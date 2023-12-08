import React, { useState } from "react";
import { Button, FileUploader } from "@carbon/react";
import axios from "axios";

const Dropbox = function () {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [invalidFileType, setInvalidFileType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter((file) => file.name.slice(-3) === "slp");
    const invalidFiles = newFiles.length !== validFiles.length;
    setInvalidFileType(invalidFiles);
    setUploadedFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadedFiles?.length > 0) {
      setIsLoading(true);
      const formData = new FormData();
      uploadedFiles?.forEach((file) => {
        formData.append("myFiles", file);
      });
      try {
        await axios.post("http://localhost:8080/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        window.location.reload();
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // const reloadPage = () => window.location.reload();

  return (
    <div className="dropbox">
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <FileUploader
          labelTitle="Drop SLP here or click to upload."
          labelDescription="Currently supports one file at a time."
          buttonLabel="Add file"
          filenameStatus="edit"
          accept={[".slp"]}
          onChange={handleFileChange}
          iconDescription="Clear file"
        />
        {invalidFileType && (
          <div style={{ color: "red", marginTop: "1rem" }}>
            Invalid file type. File types must be SLP.
          </div>
        )}
        <div
          className="dropbox-buttons"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          <Button
            type="submit"
            disabled={uploadedFiles.length === 0 || invalidFileType}
            // loading={isLoading}
          >
            Upload Matches
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Dropbox;
