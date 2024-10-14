import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Eye } from "lucide-react";
import styles from "@/styles/chat.module.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ActionPopup = ({ rowData }: { rowData?: any }) => {
  const formatTimeStamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  const formatNumbers = (number: number): string => {
    return number.toFixed(2);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip delayDuration={23}>
            <TooltipTrigger asChild>
              <span className="cursor-pointer flex justify-center">
                <Eye size={16} color="#585F6B" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="bg-[#000] text-white-900">
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className=" sm:max-w-[915px] bg-white-900 !p-0">
        <div>
          <h2 className="text-[#191F29] text-[20px] font-bold border-b py-4 px-8">
            Details
          </h2>
          <div className="px-8 py-4 max-h-[500px] overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 md:gap-6 gap-3 bg-[#E7EFFF] rounded-[12px] py-4 px-5">
              <div className="">
                <p className="font-medium text-[#191F29] text-[16px] mb-1">
                  Name
                </p>
                <p className="text-[#585F6B] text-[14px]">{rowData.name}</p>
              </div>
              <div className="">
                <p className="font-medium text-[#191F29] text-[16px] mb-1">
                  Response time
                </p>
                <p className="text-[#585F6B] text-[14px]">
                  {formatNumbers(rowData.response_time)}
                </p>
              </div>
              <div className="">
                <p className="font-medium text-[#191F29] text-[16px] mb-1">
                  Time Stamp
                </p>
                <p className="text-[#585F6B] text-[14px]">
                  {formatTimeStamp(rowData.time_stamp)}
                </p>
              </div>
            </div>
            <div className="my-6">
              <h3 className="font-bold text-[#191F29] mb-1">Question</h3>
              <div
                className=" text-black-900"
                style={{
                  hyphens: "auto",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "850px",
                }}>
                <div className={styles.chatMessage}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[remarkRehype, rehypeKatex]}
                    className="p-0">
                    {rowData.question}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="font-bold text-[#191F29] mb-1">Answer</h3>
              <div
                className=" text-black-900"
                style={{
                  hyphens: "auto",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "850px",
                }}>
                <div className={styles.chatMessage}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[remarkRehype, rehypeKatex]}
                    className="p-0">
                    {rowData.answer}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ActionPopup;
