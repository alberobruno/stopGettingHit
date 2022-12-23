import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import analyzeMoves from "../stats/AnalyzeMoves";
import Header from "../components/Header";
import PlayerStats from "../components/PlayerStats";
import Falco from "../assets/falco.png";
import Fox from "../assets/fox.png";

const Analysis = function (props) {
  const [p1MainPlayer, setP1MainPlayer] = useState(true);
  const data = useLocation().state.data;
  const id = useLocation().state.id;
  const player1 = useLocation().state.player1;
  const player2 = useLocation().state.player2;
  let playerMoves = [];
  let hasAnalysisBeenRun = false;

  //This happens twice, not sure why
  console.log("Analysis use location data: ", data);

  const togglePlayer = () => {
    setP1MainPlayer(!p1MainPlayer);
  };

  if (!hasAnalysisBeenRun) {
    hasAnalysisBeenRun = true;
    playerMoves = analyzeMoves(data);
  }

  const player1ToggleStyles = {
    filter: p1MainPlayer ? "brightness(1)" : "brightness(0.4)",
  };

  const player2ToggleStyles = {
    filter: p1MainPlayer ? "brightness(0.4)" : "brightness(1)",
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <Header
        state={{ data: data, id: id, player1: player1, player2: player2 }}
      />
      <div className="analysis">
        <div className="analysis-heading">
          <h1>Analysis</h1>
          <h5> Match ID: {id}</h5>
          <div className="select-player">
            <div className="select-player-container">
              <div
                className="select-player-1"
                onClick={togglePlayer}
                style={player1ToggleStyles}
              >
                Player 1
              </div>
              <div
                className="select-player-2"
                onClick={togglePlayer}
                style={player2ToggleStyles}
              >
                Player 2
              </div>
            </div>
          </div>
        </div>
        <div className="analysis-content">
          <div className="analysis-content-container">
            <div className="player1" style={player1ToggleStyles}>
              <img
                src={Falco}
                style={{ height: "555px", width: "340px" }}
              ></img>
              <div className="player1-name">
                <h3>{player1}</h3>
              </div>
            </div>
            <div className="analysis-content-text">
              <PlayerStats
                playerMoves={playerMoves}
                p1MainPlayer={p1MainPlayer}
              />
            </div>
            <div className="player2" style={player2ToggleStyles}>
              <img src={Fox} style={{ height: "555px", width: "340px" }}></img>
              <div className="player2-name">
                <h3>{player2}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
