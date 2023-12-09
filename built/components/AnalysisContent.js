"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PlayerStats_1 = require("../components/PlayerStats");
var falco_png_1 = require("../assets/falco.png");
var fox_png_1 = require("../assets/fox.png");
var AnalysisContent = function (props) {
    //----------Make sure we have access to data----------
    var player1 = props.player1, player2 = props.player2, toggleStyles = props.toggleStyles, playerMoves = props.playerMoves, p1MainPlayer = props.p1MainPlayer;
    return (<div className="analysis-content">
      <div className="analysis-content-container">
        <div className="player1" style={toggleStyles.p1}>
          <img src={falco_png_1.default} style={{ height: "555px", width: "340px" }}></img>
          <div className="player1-name">
            <h3>{player1}</h3>
          </div>
        </div>
        <div className="analysis-content-text">
          <PlayerStats_1.default playerMoves={playerMoves} p1MainPlayer={p1MainPlayer} player1={player1} player2={player2}/>
        </div>
        <div className="player2" style={toggleStyles.p2}>
          <img src={fox_png_1.default} style={{ height: "555px", width: "340px" }}></img>
          <div className="player2-name">
            <h3>{player2}</h3>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = AnalysisContent;
