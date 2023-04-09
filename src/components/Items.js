import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Items = function (props) {
  //----------Make sure we have access to data----------
  const { data, setData } = props;
  const { id, player1, player2 } = data;

  //----------Delete button functionality----------
  const deleteMatch = async () => {
    try {
      const fetchData = async () => {
        const axiosDelete = await axios.delete(`/delete/${id}`);
        const axiosGet = await axios.get("/getMatches");
        setData(axiosGet.data);
      };
      const grab = fetchData();
    } catch (e) {
      console.log("Deletion Error...");
    }
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{player1}</td>
      <td>{player2}</td>
      <td>
        <button
          className="btn btn-success ml-2 mt-2"
          onClick={() => deleteMatch()}
        >
          Delete
        </button>
      </td>
      <td>
        <button className="btn btn-success ml-2 mt-2">
          <Link
            to={"/analysis"}
            className="link"
            state={{ data: data, id: id, player1: player1, player2: player2 }}
          >
            Analyze Match
          </Link>
        </button>
      </td>
    </tr>
  );
};

export default Items;
