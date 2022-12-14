/**
 * @param {File} file
 * @param {HTMLElement} dropzoneElement
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, HashRouter } from "react-router-dom";

//----------Components----------
import Upload from "./Upload";
import List from "./List";
// import Home from "./Home";
import Analysis from "./Analysis";
import Footer from "./Footer";

const App = () => {
  const [data, setData] = useState();

  //----------Fetch matches table from backend----------
  useEffect(() => {
    const fetchData = async () => {
      const axiosGet = await axios.get("/getMatches");
      setData(axiosGet.data);
    };
    const grab = fetchData();
  }, []);

  //----------If data exists - render the page----------
  if (data) {
    return (
      <div>
        <HashRouter>
          <h1 className="text-center mt-5">Stop Getting Hit</h1>
          <div id="list">
            <Upload data={data} setData={setData} />
            <div className="Routes">
              <Routes>
                <Route
                  path="/"
                  element={<List data={data} setData={setData} />}
                />
                <Route path="/analysis" element={<Analysis />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </HashRouter>
      </div>
    );
  }
};

export default App;
