import React from "react";

interface ButtonProps {
  text: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Secondarybtn = ({ text, icon, className, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-normal bg-white-900 text-primary-main border border-primary-main rounded-lg py-[8px] px-[16px] flex items-center gap-[8px] ${className}`}>
      {icon && icon} <span>{text}</span>
    </button>
  );
};

export default Secondarybtn;
