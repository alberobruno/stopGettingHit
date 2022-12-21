import React, { useEffect, useState } from "react";
import axios from "axios";

//----------Components----------
import Items from "./Items";

const List = function (props) {
  //----------Make sure we have access to data----------
  const [data, setData] = useState();

  //----------Fetch matches table from backend----------
  useEffect(() => {
    const fetchData = async () => {
      const axiosGet = await axios.get("/getMatches");
      setData(axiosGet.data);
    };
    const grab = fetchData();
  }, []);

  //----------For each body, loop through data and populate----------
  if (data) {
    const rows = [];

    for (let i = 0; i < data.length; i++) {
      rows.push(<Items data={data[i]} setData={setData} key={i} />);
    }

    return (
      <div className="list">
        <div id="listComponent">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Id </th>
                <th>Player 1</th>
                <th>Player 2</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div className="list">
        <div id="listComponent">
          <span>Loading data from database...</span>
          <br></br>
          <span>(Usually takes 15 secs)</span>
        </div>
      </div>
    );
  }
};

export default List;
