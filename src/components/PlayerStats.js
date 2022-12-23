import React, { useEffect, useState } from "react";

const PlayerStats = function (props) {
  //----------Make sure we have access to data----------
  const { playerMoves, p1MainPlayer } = props;

  const p1BeatenBy = playerMoves[0];
  const p2BeatenBy = playerMoves[1];

  //Add in moves that lost
  const movesPerformed = "To be added in future version";

  const beatenBy = [];
  for (
    let i = 0;
    i < (p1MainPlayer ? p1BeatenBy.length : p2BeatenBy.length);
    i++
  ) {
    beatenBy.push(
      <tr>
        <td>{p1MainPlayer ? p1BeatenBy[i] : p2BeatenBy[i]}</td>
        <td>{movesPerformed}</td>
      </tr>
    );
  }

  return (
    <>
      <h3 style={{ marginBottom: "25px" }}>Times you lost in neutral</h3>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Moves you performed </th>
            <th>Beaten By</th>
          </tr>
        </thead>
        <tbody>{beatenBy}</tbody>
      </table>
    </>
  );
};

export default PlayerStats;
