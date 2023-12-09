"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@carbon/react");
var AnalysisHeading = function (props) {
    var id = props.id, toggleStyles = props.toggleStyles, p1MainPlayer = props.p1MainPlayer, setP1MainPlayer = props.setP1MainPlayer, player1 = props.player1, player2 = props.player2;
    var togglePlayer = function () {
        setP1MainPlayer(!p1MainPlayer);
    };
    return (<div className="analysis-heading">
      <h1 className="bx--type-display-01">Analysis</h1>
      <h5 className="bx--type-body-long-01">Match ID: {id}</h5>
      <div className="select-player">
        <div className="select-player-container">
          <react_2.Button kind={p1MainPlayer ? "primary" : "secondary"} onClick={togglePlayer} style={toggleStyles.p1}>
            {player1}
          </react_2.Button>
          <react_2.Button kind={!p1MainPlayer ? "primary" : "secondary"} onClick={togglePlayer} style={toggleStyles.p2}>
            {player2}
          </react_2.Button>
        </div>
      </div>
    </div>);
};
exports.default = AnalysisHeading;
