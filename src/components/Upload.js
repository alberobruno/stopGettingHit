import React, { useEffect, useState } from "react";
import axios from "axios";

const Upload = function (props) {
  //----------Make sure we have access to data----------
  const { data, setData } = props;
  //----------Dropzone Box Functionality----------
  const dropHandler = (e) => {
    e.preventDefault();
    document.querySelectorAll(".dropzone--input").forEach((inputElement) => {
      const dropzoneEl = inputElement.closest(".dropzone");
      const receivedFiles = e.dataTransfer.files;
      console.log("Received Files: ", receivedFiles);
      validateFiles(receivedFiles);
      if (receivedFiles.length) {
        inputElement.files = receivedFiles;
        updateThumbnail(dropzoneEl, receivedFiles[0]);
      }
      enableSubmitButton();
    });
  };
  const dropClick = (e) => {
    document.querySelectorAll(".dropzone--input").forEach((inputElement) => {
      const dropzoneEl = inputElement.closest(".dropzone");
      inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
          updateThumbnail(dropzoneEl, inputElement.files[0]);
          dropzoneEl.classList.add("dropzone--over");
        }
      });
      inputElement.click();
    });
    enableSubmitButton();
  };
  const dragOverHandler = (e) => {
    e.preventDefault();
    document.querySelectorAll(".dropzone--input").forEach((inputElement) => {
      const dropzoneEl = inputElement.closest(".dropzone");
      dropzoneEl.classList.add("dropzone--over");
    });
  };
  const dragOverEnd = () => {
    document.querySelectorAll(".dropzone--input").forEach((inputElement) => {
      const dropzoneEl = inputElement.closest(".dropzone");
      dropzoneEl.classList.remove("dropzone--over");
    });
  };

  const updateThumbnail = (dropzoneEl, file) => {
    let thumbnailEl = dropzoneEl.querySelector(".dropzone--thumbnail");

    if (dropzoneEl.querySelector(".dropzone--prompt")) {
      dropzoneEl.querySelector(".dropzone--prompt").remove();
    }
    if (!thumbnailEl) {
      thumbnailEl = document.createElement("div");
      thumbnailEl.classList.add("dropzone--thumbnail");
      dropzoneEl.appendChild(thumbnailEl);
    }

    thumbnailEl.dataset.label = file.name;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailEl.style.backgroundImage = `url('${reader.result}')`;
      };
    } else thumbnailEl.style.backgroundImage = null;
  };

  //----------Validate Uploaded Files----------
  const validateFiles = (files) => {
    // console.log("File Type: ", file.name.slice(-3));
    for (let file of files) {
      if (file.name.slice(-3) !== "slp") {
        console.log("Incorrect file type...reloading page.");
        document.querySelector("#dropbox").classList.add("dropzone--over");
        reloadPage();
      }
    }
  };

  //----------Validate Uploaded Files----------
  const resetForm = () => {
    const form = document.querySelector("#dropzoneform");
    console.log("Form: ", form);
    form.reset;
  };

  //----------Enable Submit Button----------
  const enableSubmitButton = () => {
    document.querySelector("#uploadMatchesButton").removeAttribute("disabled");
    document.querySelector("#clearButton").removeAttribute("disabled");
  };
  //----------Disable Submit Button----------
  const disableSubmitButton = () => {
    document.querySelector("#uploadMatchesButton").addAttribute("disabled");
    document.querySelector("#clearButton").addAttribute("disabled");
  };

  //----------Upload Button Functionality----------
  const upload = async () => {
    const inputData = $("#uploadInput")[0].value;
    // console.log("Input Data: ", inputData);
    try {
      const json = await JSON.parse(inputData);
      console.log("Input Accepted");
      const fetchData = async () => {
        const axiosPost = await axios.post("/upload");
        const axiosGet = await axios.get("/getMatches");
        setData(axiosGet.data);
        document.getElementById("uploadInput").value = "";
      };
      const grab = fetchData();
    } catch (e) {
      console.log("Invalid input: Must be JSON");
    }
  };

  //----------Reload Button Functionality----------
  const reloadPage = () => window.location.reload();

  //----------Render HTML----------
  return (
    <div>
      <div className="dropbox" id="dropbox">
        <form
          action="http://localhost:8080/upload"
          method="post"
          encType="multipart/form-data"
          id="dropzoneform"
          className="dropzoneform"
        >
          <div
            className="dropzone"
            id="dropzone"
            onClick={(e) => dropClick(e)}
            onDrop={(e) => dropHandler(e)}
            onDragOver={(e) => dragOverHandler(e)}
            onDragEnd={() => dragOverEnd()}
            onDragLeave={() => dragOverEnd()}
          >
            <span className="dropzone--prompt">
              Drop SLP here or click to upload.
              <br />
              Currently supports one file at a time.
            </span>
            <input
              type="file"
              name="myFile"
              className="dropzone--input"
              accept=".slp"
              multiple
            />
          </div>
          <div className="break" />
          <div className="dropboxbuttons">
            <button
              type="submit"
              className="btn btn-success ml-2"
              accept=".slp"
              id="uploadMatchesButton"
              disabled
              onClick={() => {
                disableSubmitButton();
              }}
            >
              Upload Matches
            </button>
            <button
              className="btn btn-success ml-2"
              id="clearButton"
              disabled
              action={() => reloadPage()}
            >
              Clear Selection
            </button>
            <button
              className="btn btn-success ml-2 mt-2"
              onClick={() => reloadPage()}
            >
              Reload Page
            </button>
          </div>
        </form>
      </div>
      {/* Previous Upload Logic */}
      {/* <div className="mt-5" id="JSONinput"> */}
      {/* <input type="text" id="uploadInput" /> */}
      {/* <button className="btn btn-success ml-2" onClick={() => upload()}>
          Upload Match JSON
        </button> */}
      {/* </div> */}
    </div>
  );
};

export default Upload;
