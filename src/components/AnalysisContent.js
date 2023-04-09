import React, { useEffect, useState } from "react";
import PlayerStats from "../components/PlayerStats";
import Falco from "../assets/falco.png";
import Fox from "../assets/fox.png";

const AnalysisContent = function (props) {
  //----------Make sure we have access to data----------
  const { player1, player2, toggleStyles, playerMoves, p1MainPlayer } = props;

  return (
    <div className="analysis-content">
      <div className="analysis-content-container">
        <div className="player1" style={toggleStyles.p1}>
          <img src={Falco} style={{ height: "555px", width: "340px" }}></img>
          <div className="player1-name">
            <h3>{player1}</h3>
          </div>
        </div>
        <div className="analysis-content-text">
          <PlayerStats
            playerMoves={playerMoves}
            p1MainPlayer={p1MainPlayer}
            player1={player1}
            player2={player2}
          />
        </div>
        <div className="player2" style={toggleStyles.p2}>
          <img src={Fox} style={{ height: "555px", width: "340px" }}></img>
          <div className="player2-name">
            <h3>{player2}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisContent;
