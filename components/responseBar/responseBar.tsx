"use client";

import { CheckIcon, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import ResponseRate from "../Rating/rating";
import FeedBack from "../feedback/feedback";
import { useState } from "react";

import {
  CopyIconFilled,
  CopyIcon,
  GPTIcon,
  MessageIcon,
  NewLogo,
  NewLogoBlack,
} from "@/assets/svg";
import ReactMarkdown, { Components } from "react-markdown";
import styles from "@/styles/chat.module.css";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import logo from "@/assets/spehereLogo1.png";
import Image from "next/image";

const ResponseBar = ({
  response,
  rating,
  setRating,
  ratingClick,
  sendRatingToServer,
  handleRatingClick,
  review,
  reviewHandler,
  setReview,
  id,
  chat,
}: any) => {
  const [copyText, setCopyText] = useState(false);
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<any>(null);
  const [selectedThumb, setSelectedThumb] = useState("");

  const handleCopyText = async () => {
    if (response) {
      try {
        await navigator.clipboard.writeText(response);
        setCopyText(true);
        setTimeout(() => setCopyText(false), 2000);
      } catch (err) {
        alert("Failed to copy text");
      }
    }
  };

  const components: Components = {
    a: ({ node, ...props }) => (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline inline cursor-pointer !text-primary-main">
        {props.children}
      </a>
    ),
  };

  return (
    <div className="mb-8">
      <div>
        <NewLogoBlack className="w-[105px] h-[40px]" />
      </div>
      <div className="bg-white-900 py-[.75rem] px-[1.25rem] rounded-[.5rem] mb-[.875rem] mt-1">
        <div className={styles["chatMessage"]}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[remarkRehype, rehypeKatex]}
            className="p-0"
            components={components}>
            {response}
          </ReactMarkdown>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 cursor-pointer text-[.875rem] capitalize text-[#18191B] font-medium border-r border-[#CACCCE] pr-[.375rem] hover:text-primary-main"
          onClick={handleCopyText}>
          {copyText ? (
            <>
              <CheckIcon size={20} color="#62656A" />
              <span>copied</span>{" "}
            </>
          ) : (
            <>
              <Copy size={18} className="mr-1" />
            </>
          )}
        </div>
        {/* <ResponseRate
          handleRatingClick={handleRatingClick}
          id={id}
          rating={rating}
          setRating={setRating}
          sendRatingToServer={sendRatingToServer}
        /> */}
        <div
          className="border-r border-[#CACCCE] h-[22px] flex items-center gap-2 pr-[8px]"
          onClick={() => {
            if (selectedThumb !== "down") {
              sendRatingToServer(1, id, "");
              setSelectedThumb("down");
            }
          }}>
          <ThumbsDown
            size={18}
            className={`cursor-pointer hover:text-primary-main ${
              selectedThumb === "down"
                ? "text-primary-main fill-primary-main"
                : ""
            }`}
          />
        </div>
        <div
          className="border-r border-[#CACCCE] h-[22px] flex items-center gap-2 pr-[8px]"
          onClick={() => {
            if (selectedThumb !== "up") {
              sendRatingToServer(5, id, "");
              setSelectedThumb("up");
            }
          }}>
          <ThumbsUp
            size={18}
            className={`cursor-pointer hover:text-primary-main ${
              selectedThumb === "up"
                ? "text-primary-main fill-primary-main"
                : ""
            }`}
          />
        </div>
        <FeedBack
          review={review}
          id={id}
          setReview={setReview}
          handleRatingClick={handleRatingClick}
          sendRatingToServer={sendRatingToServer}
        />
      </div>
    </div>
  );
};

export default ResponseBar;
