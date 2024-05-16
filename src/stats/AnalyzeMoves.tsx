import masterMoves from './masterMoves';

const analyzeMoves = (data: any) => {
  //----------When you lose in neutral, what moves were you hit by?
  const listOfMovesP1 = [];
  const listOfMovesP2 = [];
  const conversions = data.data.stats.conversions;

  for (const conversion of conversions) {
    //----------This means player 1 got hit----------
    if (conversion.playerIndex === 0) {
      if (conversion.openingType === 'neutral-win') {
        if (
          Object.prototype.hasOwnProperty.call(
            masterMoves,
            conversion.moves[0].moveId
          )
        ) {
          listOfMovesP1.push(masterMoves[conversion.moves[0].moveId]);
        } else {
          listOfMovesP1.push(conversion.moves[0].moveId);
        }
      }
    }
    //----------This means player 2 got hit----------
    if (conversion.playerIndex === 1) {
      if (conversion.openingType === 'neutral-win') {
        if (
          Object.prototype.hasOwnProperty.call(
            masterMoves,
            conversion.moves[0].moveId
          )
        ) {
          listOfMovesP2.push(masterMoves[conversion.moves[0].moveId]);
        } else {
          listOfMovesP2.push(conversion.moves[0].moveId);
        }
      }
    }
  }
  return [listOfMovesP1, listOfMovesP2];
};

export default analyzeMoves;
