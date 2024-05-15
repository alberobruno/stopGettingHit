import React from "react";
import { Button } from "@carbon/react";
import {ToggleStyles} from "../types"

type AnalysisHeadingProps = {
  id: string;
  toggleStyles: ToggleStyles;
  p1MainPlayer: boolean; 
  setP1MainPlayer: (p1MainPlayer: boolean) => void;
  player1: string;
  player2: string;
}

const AnalysisHeading = function (props: AnalysisHeadingProps) {
  const { id, toggleStyles, p1MainPlayer, setP1MainPlayer, player1, player2 } = props;

  const togglePlayer = () => {
    setP1MainPlayer(!p1MainPlayer);
  };

  return (
    <div className="analysis-heading">
      <h1 className="bx--type-display-01">Analysis</h1>
      <h5 className="bx--type-body-long-01">Match ID: {id}</h5>
      <div className="select-player">
        <div className="select-player-container">
          <Button
            kind={p1MainPlayer ? "primary" : "secondary"}
            onClick={togglePlayer}
            style={toggleStyles.p1}
          >
            {player1}
          </Button>
          <Button
            kind={!p1MainPlayer ? "primary" : "secondary"}
            onClick={togglePlayer}
            style={toggleStyles.p2}
          >
            {player2}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeading;
