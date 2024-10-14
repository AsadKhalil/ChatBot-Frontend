import { DocIcon, PdfIcon } from "@/assets/svg";
import { Progress } from "@/components/ui/progress";
import { Check, Trash2, X } from "lucide-react";
import { useEffect } from "react";

const UploadedFile = ({ file, onRemove, progress }: any) => {
  return (
    <div className="bg-white-900 p-3.5 rounded-[8px] border border-[#DDE1E7] flex gap-3 items-center w-full ">
      <div className="flex justify-center items-center">
        <PdfIcon />
      </div>
      <div className="w-full flex items-start justify-between">
        <div className="w-full flex flex-col items-start">
          <p className="text-[12px] text-[#051408] font-medium max-w-[170px] md:max-w-[270px] overflow-hidden text-ellipsis whitespace-nowrap">
            {file?.name}
          </p>
          <div className="text-gray-500 text-[12px] flex gap-3 items-center mt-1">
            Document
            {progress === 100 && (
              <span className="flex items-center gap-1 text-[#067647]">
                <Check size={14} /> completed
              </span>
            )}
          </div>
          {progress !== 100 && <Progress value={progress} className="mt-2" />}
        </div>
        <div className="cursor-pointer" onClick={onRemove}>
          <Trash2 size={18} strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default UploadedFile;
