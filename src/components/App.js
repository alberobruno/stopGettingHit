/**
 * @param {File} file
 * @param {HTMLElement} dropzoneElement
 */

import React, { useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";

//----------Components----------
import Upload from "./Upload";
import Analysis from "./Analysis";
import { DataContext } from "./DataContext";

const App = () => {
  const [receivedData, setReceivedData] = useState(null);
  return (
    <HashRouter>
      <DataContext.Provider value={{ receivedData, setReceivedData }}>
        <div className="Routes">
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/analysis" element={<Analysis />} />
          </Routes>
        </div>
      </DataContext.Provider>
    </HashRouter>
  );
};

export default App;
