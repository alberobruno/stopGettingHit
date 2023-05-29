import { GameEndMethod } from '../types.esm.js';
import { exists } from './exists.esm.js';

function getWinners(gameEnd, settings, finalPostFrameUpdates) {
  var _players$find$teamId, _players$find2;

  const {
    placements,
    gameEndMethod,
    lrasInitiatorIndex
  } = gameEnd;
  const {
    players,
    isTeams
  } = settings;

  if (gameEndMethod === GameEndMethod.NO_CONTEST || gameEndMethod === GameEndMethod.UNRESOLVED) {
    // The winner is the person who didn't LRAS
    if (exists(lrasInitiatorIndex) && players.length === 2) {
      var _players$find;

      const winnerIndex = (_players$find = players.find(({
        playerIndex
      }) => playerIndex !== lrasInitiatorIndex)) == null ? void 0 : _players$find.playerIndex;

      if (exists(winnerIndex)) {
        return [{
          playerIndex: winnerIndex,
          position: 0
        }];
      }
    }

    return [];
  }

  if (gameEndMethod === GameEndMethod.TIME && players.length === 2) {
    const nonFollowerUpdates = finalPostFrameUpdates.filter(pfu => !pfu.isFollower);

    if (nonFollowerUpdates.length !== players.length) {
      return [];
    }

    const p1 = nonFollowerUpdates[0];
    const p2 = nonFollowerUpdates[1];

    if (p1.stocksRemaining > p2.stocksRemaining) {
      return [{
        playerIndex: p1.playerIndex,
        position: 0
      }];
    } else if (p2.stocksRemaining > p1.stocksRemaining) {
      return [{
        playerIndex: p2.playerIndex,
        position: 0
      }];
    }

    const p1Health = Math.trunc(p1.percent);
    const p2Health = Math.trunc(p2.percent);

    if (p1Health < p2Health) {
      return [{
        playerIndex: p1.playerIndex,
        position: 0
      }];
    } else if (p2Health < p1Health) {
      return [{
        playerIndex: p2.playerIndex,
        position: 0
      }];
    } // If stocks and percents were tied, no winner


    return [];
  }

  const firstPosition = placements.find(placement => placement.position === 0);

  if (!firstPosition) {
    return [];
  }

  const winningTeam = (_players$find$teamId = (_players$find2 = players.find(({
    playerIndex
  }) => playerIndex === firstPosition.playerIndex)) == null ? void 0 : _players$find2.teamId) != null ? _players$find$teamId : null;

  if (isTeams && exists(winningTeam)) {
    return placements.filter(placement => {
      var _players$find$teamId2, _players$find3;

      const teamId = (_players$find$teamId2 = (_players$find3 = players.find(({
        playerIndex
      }) => playerIndex === placement.playerIndex)) == null ? void 0 : _players$find3.teamId) != null ? _players$find$teamId2 : null;
      return teamId === winningTeam;
    });
  }

  return [firstPosition];
}

export { getWinners };
//# sourceMappingURL=getWinners.esm.js.map
