import {
  CheckIcon,
  Link2,
  Maximize2,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";
import ResponseRate from "../Rating/rating";
import FeedBack from "../feedback/feedback";
import { useState, useEffect } from "react";
import { CopyIconFilled, CopyIcon, GPTIcon } from "@/assets/svg";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import styles from "@/styles/chat.module.css";
import logo from "@/assets/logo.png";
import Image from "next/image";
import logol from "../../assets/logo.png";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import instance from "@/utils/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const ResponseBar2 = ({
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
  cited_texts,
}: any) => {
  const [copyText, setCopyText] = useState(false);
  const [imageUrls, setImageUrls] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (response) {
      fetchHrPolicy();
    }
  }, [response]);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // setImageUrls([]);
  };

  const fetchHrPolicy = async () => {
    setLoading(true);
    try {
      const { data } = await instance.post("/hr_refrences", {
        input: response,
      });
      setImageUrls(data);
    } catch (err) {
      // @ts-ignore
      if (err.response && err.response.status === 404) {
        setError("No reference was found");
      } else {
        setError("Failed to fetch HR policy data");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div>
        <div className="max-w-[100px]">
          <Image src={logo} alt="logo" />
        </div>
      </div>
      <div className="bg-blue-500 py-[.625rem] px-[.75rem] rounded-[.25rem] mt-[1rem] mb-[.875rem] group relative">
        <div className={styles["chatMessage"]}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[remarkRehype, rehypeKatex]}
            className="p-0">
            {response}
          </ReactMarkdown>
        </div>
        <>
          <span onClick={handleClickOpen} className="flex justify-end mt-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center cursor-pointer text-[12px] leading-3 text-primary-main gap-2 bg-white-900 rounded-[5px] py-[4px] px-1.5 ml-1 hover:bg-[#E1EBFC] transition-all duration-100">
                    view reference documents
                    <SquareArrowOutUpRight strokeWidth={2} size={12} />{" "}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-white-900">
                  <p>Open references</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            className="min-w-[800px]"
            maxWidth="md"
            fullWidth>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}>
              <CloseIcon />
            </IconButton>
            <DialogContent className="bg-white-900 min-h-[500px]">
              {loading ? (
                <div className="flex justify-center items-center h-[500px]">
                  <div className="w-26 h-26 border-8 text-primary-main text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
                    <Image
                      src={logol}
                      alt="logo"
                      width={40}
                      height={40}
                      className="animate-ping"
                    />
                  </div>
                </div>
              ) : imageUrls.length ? (
                <div className="">
                  {imageUrls?.map((data: any, index: any) => (
                    <div key={index}>
                      <p className="font-bold text-[20px] text-black-900 mb-4 text-center">
                        {data.filename}
                      </p>
                      <Image
                        src={data.url}
                        alt="policy"
                        width={500}
                        height={500}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-[500px]">
                  <Typography variant="h6" color="error">
                    {error}
                  </Typography>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
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
              <CopyIcon />
              <span>copy</span>
            </>
          )}
        </div>
        <ResponseRate
          handleRatingClick={handleRatingClick}
          id={id}
          rating={rating}
          setRating={setRating}
          sendRatingToServer={sendRatingToServer}
        />
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

export default ResponseBar2;
