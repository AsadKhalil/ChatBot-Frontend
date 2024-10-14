import { GoogleIcon } from "@/assets/svg";
import React from "react";

interface googleTextProps {
  title: string;
}
const SigninWithGoogle = ({ title }: googleTextProps) => {
  return (
    <>
      <div className="flex justify-center items-center p-[12px] border border-secondary-main w-full rounded-lg mt-[40px] cursor-pointer">
        <div className="flex items-center gap-[8px] w-full justify-center">
          <GoogleIcon />
          <p className="text-lg font-bold">{title}</p>
        </div>
      </div>

      <div className="mt-[40px] w-full flex gap-[16px] items-center">
        <div className="h-[1px] w-2/4 bg-grey-100 "></div>
        <div>
          <p className="text-sm text-[#171717] font-medium whitespace-nowrap">
            or Sign in with
          </p>
        </div>
        <div className="h-[1px] w-2/4 bg-grey-100 "></div>
      </div>
    </>
  );
};

export default SigninWithGoogle;
