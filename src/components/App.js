/**
 * @param {File} file
 * @param {HTMLElement} dropzoneElement
 */

import React, { useEffect, useState } from "react";
import axios from "axios";

//Components
import List from "./List";

const App = () => {
  const [data, setData] = useState();

  //Fetch matches table from backend
  useEffect(() => {
    const fetchData = async () => {
      const axiosGet = await axios.get("/getMatches");
      setData(axiosGet.data);
    };
    const grab = fetchData();
  }, []);

  //Dropzone Box Functionality
  const dropHandler = (e) => {
    e.preventDefault();
    document.querySelectorAll(".dropzone--input").forEach((inputElement) => {
      const dropzoneEl = inputElement.closest(".dropzone");
      if (e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;
        updateThumbnail(dropzoneEl, e.dataTransfer.files[0]);
      }
    });
    dragOverEnd();
  };
  const dropClick = (e) => {
    document.querySelectorAll(".dropzone--input").forEach((inputElement) => {
      const dropzoneEl = inputElement.closest(".dropzone");
      inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
          updateThumbnail(dropzoneEl, inputElement.files[0]);
        }
      });
      inputElement.click();
    });
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

  //Upload Button Functionality
  const upload = async () => {
    const inputData = $("#uploadInput")[0].value;
    try {
      const json = await JSON.parse(inputData);
      console.log("Input Accepted");
      const fetchData = async () => {
        const axiosPost = await axios.post("/upload", json);
        const axiosGet = await axios.get("/getMatches");
        setData(axiosGet.data);
        document.getElementById("uploadInput").value = "";
      };
      const grab = fetchData();
    } catch (e) {
      console.log("Invalid input: Must be JSON");
    }
  };

  //Reload Button Functionality
  const reloadPage = () => window.location.reload();

  //If data exists - render the page
  if (data) {
    return (
      <div>
        <h1 className="text-center mt-5">Stop Getting Hit</h1>
        <div id="list">
          <div className="dropbox" id="dropbox">
            <form action="">
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
                </span>
                <input
                  type="file"
                  name="myFile"
                  className="dropzone--input"
                  multiple
                />
              </div>
            </form>
          </div>

          <div className="mt-5" id="JSONinput">
            <input type="text" id="uploadInput" />
            <button className="btn btn-success ml-2" onClick={() => upload()}>
              Upload Match JSON
            </button>
            <button
              className="btn btn-success ml-2 mt-2"
              onClick={() => reloadPage()}
            >
              Reload Page
            </button>
          </div>
          <List data={data} setData={setData} />
        </div>
      </div>
    );
  }
};

export default App;
