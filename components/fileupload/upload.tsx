import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "@/components/fileupload/upload.module.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import instance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UploadIcon } from "@/assets/svg";
import { TypeAnimation } from "react-type-animation";
import Lottie from "react-lottie-player";
import loader from "@/loader.json";


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

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [clientName, setClientName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (!supportedTypes.has(file.type)) {
        toast.error("Unsupported file type");
        return false;
      }
      return true;
    });

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
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
    if (clientName === "") {
      toast.error("Please enter client/project name");
      return;
    }
    const formData = new FormData();
    formData.append("clientName", clientName);
    files.forEach((file) => formData.append(`file`, file));
    console.log(formData.getAll("file"));

    try {
      // console.log('FormData: ', formData)
      setLoading(true);
      const response = await instance.post<{ response: string }>(
        "/upload_handle",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data.response);
      toast.success("Files uploaded successfully!");
      setFiles([]);
      setClientName("");
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={styles.uploadSecWrap}>
      <div className={styles["subheading"]}>
        Upload files to update knowledge base
      </div>
      <div className={styles["form-group"]}>
        <label htmlFor="clientName" className={styles["form-label"]}>
          Project Name:
        </label>
        <input
          type="text"
          id="clientName"
          className={styles["form-input"]}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter Name"
        />
      </div>
      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${isDragActive ? styles.active : ""}`}>
        <input {...getInputProps()} />
        <div className={styles.uploadWrap}>
          <UploadIcon />
          <div>
            <h4 className={styles["heading"]}>
              Click to upload{" "}
              <span className={styles.dragtext}>or drag and drop</span>
            </h4>
            <p>txt, pdf, docx, mp4, mp3, mpeg4</p>
          </div>
        </div>
      </div>
      {files.length > 0 && (
        <div className={styles["uploaded-files"]}>
          <h4>Uploaded Files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index} className={styles["file-item"]}>
                <span>
                  {file.name} - {file.size} bytes
                </span>
                <button onClick={() => removeFile(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className={styles["upload-button-container"]}>
            <button
              className={styles["upload-button"]}
              onClick={uploadFilesToServer}>
              Upload Files
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className={styles.overlay}>
          <Lottie loop animationData={loader} play />
          <div className={styles["loader-text"]}>
            <TypeAnimation
              sequence={[
                "Uploading and Processing your Files...",
                4000,
                "Please wait...",
                4000,
              ]}
              speed={75}
              style={{ fontSize: "1em" }}
              repeat={Infinity}
              omitDeletionAnimation={true}
              cursor={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
