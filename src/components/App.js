/**
 * @param {File} file
 * @param {HTMLElement} dropzoneElement
 */

import React, { useEffect, useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";

//----------Components----------
import Upload from "./Upload";
import List from "./List";
import Analysis from "./Analysis";

const App = () => {
  return (
    <div>
      <HashRouter>
        <h1 className="text-center mt-5" style={{ paddingTop: "50px" }}>
          Stop Getting Hit
        </h1>
        <div id="list">
          <Upload />
          <div className="Routes">
            <Routes>
              <Route path="/" element={<List />} />
              <Route path="/analysis" element={<Analysis />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </div>
  );
};

export default App;
