import { NewChatIcon, NewLogoBlack } from "@/assets/svg";
import instance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReactTyped } from "react-typed";

import MessageBar from "@/components/messageBar/messageBar";
import ResponseBar from "@/components/responseBar/responseBar";
import { Textarea } from "@/components/ui/textarea";
import useCheckMobileScreen from "@/hooks/useCheckMobileScreen";
import {
  addMessage,
  clearHistory,
  updateChatHistory,
} from "@/redux-state/chatSlice";
import { getAuthTokenCookie } from "@/utils/auth";
import { getConvoId, removeConvoId, setConvoId } from "@/utils/convoID";
import { Send } from "lucide-react";

interface ChatMessage {
  prompt: string;
  response: string;
  rating: number | null;
  review: string;
  queryId: string;
  convoId: string | null;
}

const Chatbot: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const store = useStore();
  const [prompt, setPrompt] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const [history, setHistory] = useState<[]>([]);
  const [token, setToken] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [showRatingPopup, setShowRatingPopup] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>("");
  const [queryId, setqueryId] = useState<string>("");
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState(false);
  const isTab = useCheckMobileScreen(1300);
  const isMobile = useCheckMobileScreen(600);

  const msgRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (!getAuthTokenCookie()) {
      router.push("/login");
    }

    const fetchConversation = async () => {
      try {
        setLoadingHistory(true);
        const convoId = getConvoId();
        const { data } = await instance.post<{ response: any }>(
          "/conversation",
          {
            //@ts-ignore
            conversation_id: convoId,
          }
        );
        //@ts-ignore
        dispatch(updateChatHistory(data));
        //@ts-ignore
        setChatHistory(store.getState().chat.chatHistory);
      } catch (error) {
        console.error("Error fetching conversation:", error);
        toast.error("Error fetching conversation");
      } finally {
        setLoadingHistory(false);
      }
    };
    //@ts-ignore
    if (
      getConvoId() &&
      getConvoId() !== "" &&
      //@ts-ignore
      store.getState().chat.chatHistory.length === 0
    ) {
      fetchConversation();
    }
    //@ts-ignore
    setChatHistory(store.getState().chat.chatHistory);
    if (getConvoId() === "") {
      setConvoId("");
    }
  }, []);

  const handleNewChat = () => {
    dispatch(clearHistory());
    removeConvoId();
    setConvoId("");
    window.location.reload();
  };
  const ORIGINAL_HEIGHT = 52;
  const adjustTextareaHeight = (
    element: HTMLTextAreaElement,
    reset: boolean = false
  ) => {
    if (reset) {
      element.style.height = `${ORIGINAL_HEIGHT}px`;
    }
    element.style.height = "auto";
    const newHeight = Math.min(element.scrollHeight, 5 * 24);
    element.style.height = `${newHeight}px`;
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    adjustTextareaHeight(e.target);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        event.preventDefault();
        const textarea = event.currentTarget;
        const cursorPosition = textarea.selectionStart;
        const textBeforeCursor = prompt.slice(0, cursorPosition);
        const textAfterCursor = prompt.slice(cursorPosition);
        setPrompt(textBeforeCursor + "\n" + textAfterCursor);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1;
          adjustTextareaHeight(textarea);
        }, 0);
      } else {
        event.preventDefault();
        handleSubmit(event);
      }
    }
  };

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const userPrompt = prompt.trim();
    setPrompt("");
    if (userPrompt === "") return;

    const newMessage: ChatMessage = {
      prompt: userPrompt,
      response: "",
      rating: null,
      review: "",
      queryId: "",
      convoId: getConvoId(),
    };

    setChatHistory([...chatHistory, newMessage]);
    setPending(true);
    try {
      const { data } = await instance.post<{ response: string }>("/generate", {
        input: userPrompt,
        chat_history: chatHistory,
        convo_id: getConvoId() ? getConvoId() : "",
      });

      const updatedChat = [
        ...chatHistory,
        {
          ...newMessage,
          response: data.response,
          //@ts-ignore
          queryId: data.query_id,
          //@ts-ignore
          convoId: data.convo_id,
        },
      ];
      //@ts-ignore
      setqueryId(data.query_id);
      setChatHistory(updatedChat);
      dispatch(addMessage(updatedChat[updatedChat.length - 1]));
      //@ts-ignore
      setConvoId(data.convo_id);
    } catch (error) {
      console.error("Error fetching response:", error);
      toast.error("Error fetching response");
    } finally {
      setPending(false);
      if (!hasAnswered) setHasAnswered(true);
    }
  };

  const handleRatingClick = (queryId: string) => {
    setqueryId(queryId);
    // setShowRatingPopup(true);
  };
  const sendRatingToServer = async (rating: any, id: any, review: any) => {
    try {
      toast.info("Submitting Feedback...");
      const res = await instance.post("/rating", {
        query_id: id,
        rating: rating,
        review: review,
      });
      setShowRatingPopup(false);
      toast.success("Thank you for your feedback.");
      setRating(null);
      setReview("");
      setqueryId("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Error submitting rating");
    }
  };

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatHistory]);
  return (
    <>
      {chatHistory.length > 0 && (
        <div
          className={`flex items-center justify-end ${
            isTab ? "static" : "absolute"
          } right-8`}>
          <button
            onClick={handleNewChat}
            className="bg-primary-main py-[10px] px-4 rounded-[8px] flex items-center text-white-800 gap-[8px] capitalize text-[14px] font-medium">
            <NewChatIcon />
            new chat
          </button>
        </div>
      )}
      <div
        className={`${
          isTab && chatHistory.length ? "pt-3 !h-[calc(100dvh-140px)] pr-1" : ""
        } flex flex-col h-full justify-between`}>
        <div className={`overflow-auto flex-1`}>
          <div
            className={`flex flex-col w-full justify-center max-w-[700px] mx-auto ${
              chatHistory.length === 0 ? "h-full" : ""
            }`}>
            <div className={`flex-grow pr-1`}>
              {chatHistory.length === 0 ? (
                <div className="flex flex-col h-full justify-center items-center">
                  <div>
                    <p className="text-[#18191B] text-center mb-4 text-[32px] font-bold">
                      Ask AI
                    </p>
                    <p className="text-center">
                      {process.env.NEXT_PUBLIC_TAG_LINE}
                    </p>
                  </div>
                </div>
              ) : (
                chatHistory.map((chat, index) => (
                  <div key={index} className="" ref={msgRef}>
                    <MessageBar message={chat.prompt} />
                    <div className="relative">
                      {chat?.response && (
                        <ResponseBar
                          response={chat?.response}
                          handleRatingClick={handleRatingClick}
                          id={chat.queryId}
                          rating={rating}
                          setRating={setRating}
                          sendRatingToServer={sendRatingToServer}
                          review={review}
                          setReview={setReview}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div
          className={`${
            isTab ? (isMobile ? "" : "pb-3") : ""
          } pt-3 w-full max-w-[700px] mx-auto`}>
          {chatHistory.length > 0 &&
            !chatHistory[chatHistory.length - 1]?.response && (
              <div className="flex gap-2 mb-2">
                <div className="thinkWrap">
                  <div className="frstBall ball"></div>
                  <div className="secondBall ball"></div>
                  <div className="thirdBall ball"></div>
                </div>
                <div className="thinking">
                  Thinking<span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </div>
              </div>
            )}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex gap-[16px] items-center w-full border rounded-full overflow-hidden bg-white-900 inputGradient">
              <Textarea
                className="!mt-0 border-0 focus:bg-white-900 resize-none min-h-[52px] h-[52px] py-4 pl-6 text-[14px] leading-5"
                value={prompt}
                onKeyDown={handleKeyDown}
                onChange={handleTextareaChange}
                rows={1}
                placeholder="Enter your own prompt..."
                ref={inputRef}
              />
              <button className="bg-[#016BEF] min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center mr-2">
                <Send size={16} color="#fff" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
