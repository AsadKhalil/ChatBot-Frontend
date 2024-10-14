import { EyeClosed, EyeOpen } from "@/assets/svg";
import React, { ChangeEvent, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  label?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
const InputField = ({
  type,
  label,
  onChange,
  className,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full">
      <label className={`text-sm font-medium text-black-900 block text-start`}>
        {label}
      </label>
      <input
        type={type === "password" && showPassword ? "text" : type}
        {...props}
        onChange={onChange}
        className={`w-full px-2.5 py-[12px] border border-[#DDE1E7] rounded-lg focus:outline-none hover:border-[#70A0F7] focus:bg-white-900  text-[14px] font-normal mt-[9px] leading-[18px] placeholder:text-gray-500 disabled:bg-[#E8ECF0] ${className}`}
      />
      {type === "password" && (
        <span
          className="absolute top-[50%] right-[24px] transform translate-y-[22%] cursor-pointer"
          onClick={togglePasswordVisibility}>
          {showPassword ? <EyeOpen /> : <EyeClosed />}
        </span>
      )}
    </div>
  );
};

export default InputField;
