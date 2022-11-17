/**
 * @param {File} file
 * @param {HTMLElement} dropzoneElement
 */

import React, { useEffect, useState } from "react";
import axios from "axios";

//----------Components----------
import Upload from "./Upload";
import List from "./List";

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
        <h1 className="text-center mt-5">Stop Getting Hit</h1>
        <div id="list">
          <Upload />
          <List data={data} setData={setData} />
        </div>
      </div>
    );
  }
};

export default App;
