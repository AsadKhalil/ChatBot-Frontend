import { MessageSquareText } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessageIcon, MessageIconFilled, StarIcon2 } from "@/assets/svg";
import PrimaryBtn from "../common/PrimaryBtn";
import Secondarybtn from "../common/Secondarybtn";
import { PopoverClose } from "@radix-ui/react-popover";
import { Textarea } from "@/components/ui/textarea";
import useCheckMobileScreen from "@/hooks/useCheckMobileScreen";

const FeedBack = ({
  review,
  reviewHandler,
  setReview,
  sendRatingToServer,
  handleRatingClick,
  id,
}: any) => {
  const isMobile = useCheckMobileScreen(650);

  return (
    <Popover>
      <PopoverTrigger className="group" onClick={() => handleRatingClick(id)}>
        <div className="flex items-center gap-2 cursor-pointer text-[14px] capitalize text-[#18191B] font-medium hover:text-primary-main">
          <MessageIcon className="block group-hover:hidden" />
          <MessageIconFilled className="hidden group-hover:block" />
          Feedback
        </div>
      </PopoverTrigger>
      <div>
        <PopoverContent
          className={`bg-white-800 border-blue-400 p-[12px] relative ${
            isMobile ? "w-[390px]" : "w-[500px]"
          }`}
          sideOffset={5}>
          <span className="absolute top-0 right-[50%] size-[12px] arrow"></span>
          <>
            <p className="text-[#18191B] font-bold text-[16px] mb-[12px]">
              Feedback
            </p>
            <div>
              <Textarea
                placeholder="Type your message here."
                className="border-blue-400 outline-none focus-visible:ring-0 resize-none"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 justify-end mt-[10px] w-full">
              <PopoverClose className="justify-end mt-[10px] w-fit text-sm font-normal bg-white-900 text-primary-main border border-primary-main rounded-lg py-[8px] px-[16px] flex items-center gap-[8px]">
                Cancel
              </PopoverClose>
              <PopoverClose
                className="flex items-center gap-3 justify-end mt-[10px] w-fit text-sm font-normal bg-primary-main text-[#fff] rounded-lg py-[8px] px-[16px]"
                onClick={() => sendRatingToServer(null, id, review)}>
                Submit
              </PopoverClose>
            </div>
          </>
        </PopoverContent>
      </div>
    </Popover>
  );
};

export default FeedBack;
