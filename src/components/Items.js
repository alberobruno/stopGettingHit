import React, { useEffect, useState } from "react";
import axios from "axios";
import masterMoves from "./masterMoves";

const Items = function (props) {
  //Make sure I have access to data
  const { data, setData } = props;
  const { id, player1, player2 } = data;

  //Delete button functionality
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

  const analyze = () => {
    //When you lose in neutral, what moves were you hit by?
    const listOfMovesP1 = [];
    const listOfMovesP2 = [];
    const conversions = data.data.stats.conversions;

    for (let conversion of conversions) {
      //This means player 1 got hit
      if (conversion.playerIndex === 0) {
        if (conversion.openingType === "neutral-win") {
          if (masterMoves.hasOwnProperty(conversion.moves[0].moveId)) {
            listOfMovesP1.push(masterMoves[conversion.moves[0].moveId]);
          } else {
            listOfMovesP1.push(conversion.moves[0].moveId);
          }
        }
      }
      if (conversion.playerIndex === 1) {
        //This means player 2 got hit
        if (conversion.openingType === "neutral-win") {
          if (masterMoves.hasOwnProperty(conversion.moves[0].moveId)) {
            listOfMovesP2.push(masterMoves[conversion.moves[0].moveId]);
          } else {
            listOfMovesP2.push(conversion.moves[0].moveId);
          }
        }
      }
    }

    //Append to body
    const myDiv = document.createElement("div");
    myDiv.style.textAlign = "center";
    myDiv.innerHTML = `
    <h5>Analyzing match id: ${id}... where did we lose neutral?</h5>
    <p>Player1 (${player1}) should stop getting hit by </p><p>[${listOfMovesP1}]\n</p>
    <p>Player2 (${player2}) should stop getting hit by </p><p>[${listOfMovesP2}]\n</p>`;
    document.body.appendChild(myDiv);
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
        <button className="btn btn-success ml-2 mt-2" onClick={() => analyze()}>
          Analyze Match
        </button>
      </td>
    </tr>
  );
};

export default Items;
