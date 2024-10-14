import { PdfIcon } from "@/assets/svg";
import { Progress } from "@/components/ui/progress";
import { Trash2, X } from "lucide-react";
import { useEffect } from "react";

const UploadedFile2 = ({ file, onRemove, progress }: any) => {
  return (
    <div className="bg-white-900 p-3.5 rounded-[8px] border border-[#DDE1E7] flex gap-3 items-center w-full my-3.5 ">
      <div className="flex justify-center items-center">
        <PdfIcon />
      </div>
      <div className="w-full flex items-start justify-between">
        <div className="w-full flex flex-col items-start">
          <p className="text-[12px] text-[#051408] font-medium max-w-[170px] md:max-w-[270px] overflow-hidden text-ellipsis whitespace-nowrap">
            {file?.name}
          </p>
          <span className="text-gray-500 text-[12px] block pb-2">Document</span>
          <Progress value={progress} />
        </div>
        <div className="cursor-pointer" onClick={onRemove}>
          <Trash2 size={18} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default UploadedFile2;
