import React, { useEffect, useState, useContext } from "react";
import { DataContext } from "./DataContext";
import axios from "axios";

//----------Components----------
import Items from "./Items";

const List = function (props) {
  //----------Make sure we have access to data----------
  const { receivedData, setReceivedData } = useContext(DataContext);

  if (false) {
  }
  //----------Fetch matches table from backend----------
  else {
    console.log("Getting into Else in List");
    useEffect(() => {
      const fetchData = async () => {
        const axiosGet = await axios.get("/getMatches");
        setReceivedData(axiosGet.data);
      };
      const grab = fetchData();
    }, []);
  }

  //----------For each body, loop through data and populate----------
  if (receivedData) {
    let data = receivedData;
    const rows = [];

    for (let i = 0; i < data.length; i++) {
      rows.push(<Items data={data[i]} setData={setReceivedData} key={i} />);
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
