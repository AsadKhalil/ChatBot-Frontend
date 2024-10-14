import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "@/components/fileupload/upload.module.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import instance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Label } from "../ui/label";
import UploadedFile from "../uploadedFile/uploadedFile";
import { UploaderIcon2 } from "@/assets/svg";
import PrimaryBtn from "../common/PrimaryBtn";

const supportedTypes = new Set([
  "application/pdf",
  ".doc",
  ".docx",
  ".xml,application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "audio/mpeg",
  "video/mp4",
]);

const KBUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [clientName, setClientName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) =>
      supportedTypes.has(file.type)
    );
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    handleFileUpload(validFiles);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  useEffect(() => {
    console.log("Uploaded Files:", files);
  }, [files]);

  const uploadFilesToServer = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append(`files`, file));
    console.log(formData.getAll("file"));
    setLoading(true);
    try {
      const response = await instance.post<{ response: string }>(
        "/create_knowledge_base",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response);
      console.log("Response Status:", response.status);
      if (response.status == 200) {
        toast.success("Files uploaded successfully!");
        setFiles([]);
        setClientName("");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
    },
    onDropRejected: () => {
      toast.error("File type not accepted. Please upload a .pdf file.");
    },
  });
  const handleFileUpload = (e: any) => {
    const file = e;
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);
      }
    };
    xhr.open("POST", "", true);
    xhr.send(formData);
  };

  return (
    <div className="max-w-[580px] w-full mx-auto text-center">
      <div className="text-start mb-4">
        <p className=" text-black-900 font-bold mb-1 headingText">
          Add Data To Knowledge Base
        </p>
        <p>Upload files to augment your bot's knowledge base.</p>
      </div>
      <div
        {...getRootProps()}
        className="relative cursor-pointer h-[230px] border border-dashed border-[#dde1e7] flex justify-center items-center flex-col bg-white-900 rounded-[8px]">
        <input {...getInputProps()} className="hidden" accept=".docx" />
        {isDragActive ? (
          <p className="text-[14px] mt-[16px]">Drop the files here ...</p>
        ) : (
          <>
            <div className="">
              <UploaderIcon2 />
            </div>
            <p className="text-[14px] mt-[16px] ">
              <span className="text-primary-main underline">
                Click to Upload
              </span>{" "}
              or drag and drop file
              <br />
              <span className="text-[14px] text-grey-500 mt-1 block">
                Limit 100MB overall
              </span>
              <span className="text-[14px] text-grey-500">
                Supported Format: .pdf
              </span>
            </p>
          </>
        )}
      </div>
      {files.length > 0 && (
        <div>
          <ul className="max-h-[calc(100dvh-535px)] overflow-auto pr-1">
            {files.map((file, index) => (
              <div key={index} className="my-3.5 last:mb-0">
                <UploadedFile
                  file={file}
                  progress={progress}
                  onRemove={() => removeFile(index)}
                />
                {/* <li key={index} className={styles["file-item"]}>
                  <span>
                    {file.name} - {file.size} bytes
                  </span>
                  {!loading && (
                    <button onClick={() => removeFile(index)}>Remove</button>
                  )}
                </li> */}
              </div>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-[30px]">
        <PrimaryBtn
          className="w-full !py-3"
          onClick={uploadFilesToServer}
          disabled={loading || files.length === 0}>
          {loading ? "Uploading..." : "Upload Files"}
        </PrimaryBtn>
      </div>
    </div>
  );
};

export default KBUpload;
