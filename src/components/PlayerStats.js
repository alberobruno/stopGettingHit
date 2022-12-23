import React, { useEffect, useState } from "react";

const PlayerStats = function (props) {
  //----------Make sure we have access to data----------
  const { playerMoves, p1MainPlayer } = props;

  return (
    <>
      <p>You lost in neutral to the following moves </p>
      {p1MainPlayer ? playerMoves[0] : playerMoves[1]}
    </>
  );
};

export default PlayerStats;
