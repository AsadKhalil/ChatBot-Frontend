import React from "react";

interface ButtonProps {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
const PrimaryBtn = ({
  children,
  onClick,
  className,
  disabled,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-sm font-normal bg-primary-main text-[#fff] rounded-lg py-[12px] px-[16px] ${className}`}>
      {children}
    </button>
  );
};

export default PrimaryBtn;
