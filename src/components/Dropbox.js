import React, { useState } from "react";
import { Button, FileUploader } from "@carbon/react";
import axios from "axios"; // Make sure to install axios if not already

const Dropbox = function () {
  const [selectedFile, setSelectedFile] = useState(null);
  const [invalidFileType, setInvalidFileType] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.slice(-3) !== "slp") {
      setInvalidFileType(true);
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
      setInvalidFileType(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("myFile", selectedFile);

      try {
        await axios.post("http://localhost:8080/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // Refresh the page after successful upload
        window.location.reload();
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const reloadPage = () => window.location.reload();

  return (
    <div className="dropbox">
      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <FileUploader
          labelTitle="Drop SLP here or click to upload."
          labelDescription="Currently supports one file at a time."
          buttonLabel="Add file"
          filenameStatus="edit"
          accept={[".slp"]}
          multiple={false}
          onChange={handleFileChange}
          iconDescription="Clear file"
          invalid={invalidFileType}
          invalidText="Invalid file type."
        />
        <div
          className="dropbox-buttons"
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          <Button type="submit" disabled={!selectedFile}>
            Upload Matches
          </Button>
          <Button onClick={reloadPage} style={{ marginLeft: "1rem" }}>
            Reload Page
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Dropbox;
