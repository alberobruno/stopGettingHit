import React from 'react';

const AnalysisHeading = function (props) {
  //----------Make sure we have access to data----------
  const { id, toggleStyles, p1MainPlayer, setP1MainPlayer, player1, player2 } =
    props;

  const togglePlayer = () => {
    setP1MainPlayer(!p1MainPlayer);
  };

  return (
    <div className="analysis-heading">
      <h1>Analysis</h1>
      <h5> Match ID: {id}</h5>
      <div className="select-player">
        <div className="select-player-container">
          <div
            className="select-player-1"
            onClick={togglePlayer}
            style={toggleStyles.p1}
          >
            <span>{player1}</span>
          </div>
          <div
            className="select-player-2"
            onClick={togglePlayer}
            style={toggleStyles.p2}
          >
            <span>{player2}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeading;
