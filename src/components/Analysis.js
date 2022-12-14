import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import masterMoves from "./masterMoves";

const Analysis = function (props) {
  const data = useLocation().state.data;
  const id = useLocation().state.id;
  const player1 = useLocation().state.player1;
  const player2 = useLocation().state.player2;

  console.log("State Params Value: ", data);

  const analyze = () => {
    //----------When you lose in neutral, what moves were you hit by?
    const listOfMovesP1 = [];
    const listOfMovesP2 = [];
    const conversions = data.data.stats.conversions;

    for (let conversion of conversions) {
      //----------This means player 1 got hit----------
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
        //----------This means player 2 got hit----------
        if (conversion.openingType === "neutral-win") {
          if (masterMoves.hasOwnProperty(conversion.moves[0].moveId)) {
            listOfMovesP2.push(masterMoves[conversion.moves[0].moveId]);
          } else {
            listOfMovesP2.push(conversion.moves[0].moveId);
          }
        }
      }
    }

    //----------Append to body----------
    const myDiv = document.createElement("div");
    myDiv.style.textAlign = "center";
    myDiv.innerHTML = `
    <h5>Analyzing match id: ${id}... where did we lose neutral?</h5>
    <p>Player1 (${player1}) should stop getting hit by </p><p>[${listOfMovesP1}]\n</p>
    <p>Player2 (${player2}) should stop getting hit by </p><p>[${listOfMovesP2}]\n</p>`;
    document.body.appendChild(myDiv);
  };
  analyze();
  return (
    <div>
      <span>This is the analysis page</span>
    </div>
  );
};

export default Analysis;
