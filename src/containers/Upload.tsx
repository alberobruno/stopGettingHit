import React from "react";
import Dropbox from "../components/Dropbox";
import List from "./List";

const Upload = function () {
  return (
    <>
      <h1
        className="bx--type-semibold text-center mt-5"
        style={{ paddingTop: "50px" }}
      >
        Stop Getting Hit
      </h1>
      <Dropbox />
      <List />
    </>
  );
};

export default Upload;
