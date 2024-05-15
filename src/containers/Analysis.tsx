import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import analyzeMoves from '../stats/AnalyzeMoves';
import Header from '../components/Header';
import AnalysisHeading from '../components/AnalysisHeading';
import AnalysisContent from '../components/AnalysisContent';

import { AnalysisContext } from '../contexts/AnalysisContext';

const Analysis = function () {
  //Playing with Analysis Context
  const [analysisState, setAnalysisState] = useState(null);

  const [p1MainPlayer, setP1MainPlayer] = useState(true);
  const data = useLocation().state.data;
  const id = useLocation().state.id;
  const player1 = useLocation().state.player1;
  const player2 = useLocation().state.player2;

  let playerMoves = [];
  let hasAnalysisBeenRun = false;

  //TODO: This happens twice, not sure why
  console.log('Analysis use location data: ', data);

  if (!hasAnalysisBeenRun) {
    hasAnalysisBeenRun = true;
    playerMoves = analyzeMoves(data);
  }

  const toggleStyles = {
    p1: { filter: p1MainPlayer ? 'brightness(1)' : 'brightness(0.4)' },
    p2: { filter: p1MainPlayer ? 'brightness(0.4)' : 'brightness(1)' },
  };

  return (
    <>
      <AnalysisContext.Provider value={{ analysisState, setAnalysisState }}>
        <Header
          state={{ data: data, id: id, player1: player1, player2: player2 }}
        />
        <div className="analysis">
          <AnalysisHeading
            id={id}
            toggleStyles={toggleStyles}
            p1MainPlayer={p1MainPlayer}
            setP1MainPlayer={setP1MainPlayer}
            player1={player1}
            player2={player2}
          />
          <AnalysisContent
            playerMoves={playerMoves}
            p1MainPlayer={p1MainPlayer}
            toggleStyles={toggleStyles}
            player1={player1}
            player2={player2}
          />
        </div>
      </AnalysisContext.Provider>
    </>
  );
};

export default Analysis;
