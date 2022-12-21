/**
 * @param {File} file
 * @param {HTMLElement} dropzoneElement
 */

import React, { useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";

//----------Components----------
import Upload from "./Upload";
import List from "./List";
import Analysis from "./Analysis";
import { DataContext } from "./DataContext";

const App = () => {
  const [receivedData, setReceivedData] = useState(null);
  return (
    <HashRouter>
      <DataContext.Provider value={{ receivedData, setReceivedData }}>
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
      </DataContext.Provider>
    </HashRouter>
  );
};

export default App;
