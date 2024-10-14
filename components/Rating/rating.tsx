import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StarIcon2, StarIcon, FillStarIcon } from "@/assets/svg";
import PrimaryBtn from "../common/PrimaryBtn";
import Secondarybtn from "../common/Secondarybtn";
import { PopoverClose } from "@radix-ui/react-popover";

const Rating = ({
  rating,
  setRating,
  ratingClick,
  sendRatingToServer,
  id,
  handleRatingClick,
}: any) => {
  // const [rating, setRating] = useState(0);
  const [totalStars, setTotalStars] = useState(5);
  return (
    <Popover>
      <PopoverTrigger className="group" onClick={() => handleRatingClick(id)}>
        <div className="flex font-medium items-center gap-2 cursor-pointer text-[14px] capitalize text-[#18191B] border-r border-[#CACCCE] pr-[6px] group-hover:text-primary-main">
          <StarIcon className="hidden group-hover:block" />
          <StarIcon2 className="block group-hover:hidden" />
          Rate Response?
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="bg-white-800 border-blue-400 p-[12px]"
        sideOffset={5}>
        <span className="absolute top-0 right-[50%] size-[12px] responseArrow"></span>
        <p className="text-[#18191B] font-bold text-[16px] mb-4">
          Rate the Response
        </p>
        <div className="flex justify-between mb-4">
          {[...Array(totalStars)].map((star, index) => {
            const currentRating = index + 1;
            return (
              <label
                key={index}
                className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={rating || 0}
                  onChange={() => setRating(currentRating)}
                  className="hidden"
                />
                {currentRating <= rating ? <FillStarIcon /> : <StarIcon2 />}
                <span className="text-[#18191B] text-[14px]">
                  {currentRating}
                </span>
              </label>
            );
          })}
        </div>
        <div className="flex items-center gap-3 justify-end mt-[10px] w-full">
          <PopoverClose className="justify-end mt-[10px] w-fit text-sm font-normal bg-white-900 text-primary-main border border-primary-main rounded-lg py-[8px] px-[16px] flex items-center gap-[8px]">
            Cancel
          </PopoverClose>
          <PopoverClose
            className="flex items-center gap-3 justify-end mt-[10px] w-fit text-sm font-normal bg-primary-main text-[#fff] rounded-lg py-[8px] px-[16px]"
            onClick={sendRatingToServer}>
            Submit
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Rating;
