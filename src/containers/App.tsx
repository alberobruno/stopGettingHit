/**
 * @param {File} file
 * @param {HTMLElement} dropzoneElement
 */

import React, { useState } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import "./app.scss";

//----------Components----------
import Upload from "./Upload";
import Analysis from "./Analysis";
import { DataContext } from "../contexts/DataContext";
import { StateProvider } from "../state/data.state";

const App = () => {
  const [receivedData, setReceivedData] = useState(null);
  return (
    <HashRouter>
      <StateProvider>
        <DataContext.Provider value={{ receivedData, setReceivedData }}>
          <div className="Routes">
            <Routes>
              <Route path="/" element={<Upload />} />
              <Route path="/analysis" element={<Analysis />} />
            </Routes>
          </div>
        </DataContext.Provider>
      </StateProvider>
    </HashRouter>
  );
};

export default App;
