import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import masterMoves from "./masterMoves";
import Header from "./Header";
import Falco from "../assets/falco.png";
import Fox from "../assets/fox.png";

const Analysis = function (props) {
  const data = useLocation().state.data;
  const id = useLocation().state.id;
  const player1 = useLocation().state.player1;
  const player2 = useLocation().state.player2;
  let playerMoves = [];
  let hasAnalysisBeenRun = false;

  //This happens twice, not sure why
  console.log("Analysis use location data: ", data);

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
      //----------This means player 2 got hit----------
      if (conversion.playerIndex === 1) {
        if (conversion.openingType === "neutral-win") {
          if (masterMoves.hasOwnProperty(conversion.moves[0].moveId)) {
            listOfMovesP2.push(masterMoves[conversion.moves[0].moveId]);
          } else {
            listOfMovesP2.push(conversion.moves[0].moveId);
          }
        }
      }
    }
    playerMoves = [listOfMovesP1, listOfMovesP2];
  };

  if (!hasAnalysisBeenRun) {
    hasAnalysisBeenRun = true;
    analyze();
  }

  return (
    <div style={{ marginTop: "60px" }}>
      <Header
        state={{ data: data, id: id, player1: player1, player2: player2 }}
      />
      <div className="analysis">
        <div className="analysis-heading">
          <h1>Analysis</h1>
          <h5> Match ID: {id}</h5>
        </div>
        <div className="analysis-content">
          <div className="player1">
            <img src={Falco} style={{ height: "555px", width: "340px" }}></img>
            <div>Player1 ({player1})</div>
          </div>
          <div className="analysis-content-text">
            <p>lost in neutral to the following moves </p>
            <p>[{playerMoves[0]}]</p>
            <p>Player2 ({player2}) lost in neutral to the following moves </p>
            <p>[{playerMoves[1]}]</p>
          </div>
          <div className="player1">
            <img src={Fox} style={{ height: "555px", width: "340px" }}></img>
            <div>Player2 ({player2})</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
