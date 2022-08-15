import React, { useEffect, useState } from 'react';
import axios from 'axios';
// moves.getMoveName(55);

const Items = function (props) {
  //Make sure I have access to data
  const { data, setData } = props;
  const { id, player1, player2 } = data;

  //Delete button functionality
  const deleteMatch = async () => {
    try {
      const fetchData = async () => {
        const axiosDelete = await axios.delete(`/delete/${id}`);
        const axiosGet = await axios.get('/getMatches');
        setData(axiosGet.data);
      };
      const grab = fetchData();
    } catch (e) {
      console.log('Deletion Error!!!');
    }
  };

  const analyze = () => {
    //When you lose in neutral, what moves were you hit by?
    const listOfMovesP1 = [];
    const listOfMovesP2 = [];
    const conversions = data.data.stats.conversions;
    console.log(conversions[0].moves[0].moveId);
    //Long list of moveId names
    const masterMoves = {
      0: 'Unknown Move',
      1: 'Miscellaneous',
      2: 'Jab',
      3: 'Jab',
      4: 'Jab',
      5: 'Rapid Jabs',
      6: 'Dash Attack',
      7: 'Forward Tilt',
      8: 'Up Tilt',
      9: 'Down Tilt',
      10: 'Forward Smash',
      11: 'Up Smash',
      12: 'Down Smash',
      13: 'Neutral Air',
      14: 'Forward Air',
      15: 'Back Air',
      16: 'Up Air',
      17: 'Down Air',
      18: 'Neutral B',
      19: 'Side B',
      20: 'Up B',
      21: 'Down B',
      22: 'Unknown Move',
      23: 'Unknown Move',
      24: 'Unknown Move',
      25: 'Unknown Move',
      26: 'Unknown Move',
      27: 'Unknown Move',
      28: 'Unknown Move',
      29: 'Unknown Move',
      30: 'Unknown Move',
      31: 'Unknown Move',
      32: 'Unknown Move',
      33: 'Unknown Move',
      34: 'Unknown Move',
      35: 'Unknown Move',
      36: 'Unknown Move',
      37: 'Unknown Move',
      38: 'Unknown Move',
      39: 'Unknown Move',
      40: 'Unknown Move',
      41: 'Unknown Move',
      42: 'Unknown Move',
      43: 'Unknown Move',
      44: 'Unknown Move',
      45: 'Unknown Move',
      46: 'Unknown Move',
      47: 'Unknown Move',
      48: 'Unknown Move',
      49: 'Unknown Move',
      50: 'Getup Attack',
      51: 'Getup Attack (Slow)',
      52: 'Grab Pummel',
      53: 'Forward Throw',
      54: 'Back Throw',
      55: 'Up Throw',
      56: 'Down Throw',
      57: 'Unknown Move',
      58: 'Unknown Move',
      59: 'Unknown Move',
      60: 'Unknown Move',
      61: 'Edge Attack (Slow)',
      62: 'Edge Attack',
      63: 'Unknown Move',
      64: 'Unknown Move',
      65: 'Unknown Move',
      66: 'Unknown Move',
      67: 'Unknown Move',
      68: 'Unknown Move',
      69: 'Unknown Move',
      70: 'Unknown Move',
      71: 'Unknown Move',
      72: 'Unknown Move',
      73: 'Unknown Move',
      74: 'Unknown Move',
      75: 'Unknown Move',
      76: 'Unknown Move',
      77: 'Unknown Move',
      78: 'Unknown Move',
      79: 'Unknown Move',
      80: 'Unknown Move',
      81: 'Unknown Move',
      82: 'Unknown Move',
      83: 'Unknown Move',
      84: 'Unknown Move',
      85: 'Unknown Move',
      86: 'Unknown Move',
      87: 'Unknown Move',
      88: 'Unknown Move',
      89: 'Unknown Move',
      90: 'Unknown Move',
      91: 'Unknown Move',
      92: 'Unknown Move',
      93: 'Unknown Move',
      94: 'Unknown Move',
      95: 'Unknown Move',
      96: 'Unknown Move',
      97: 'Unknown Move',
      98: 'Unknown Move',
      99: 'Unknown Move',
      100: 'Unknown Move',
    };

    for (let conversion of conversions) {
      //This means player 1 got hit
      if (conversion.playerIndex === 0) {
        if (conversion.openingType === 'neutral-win') {
          if (masterMoves.hasOwnProperty(conversion.moves[0].moveId)) {
            listOfMovesP1.push(masterMoves[conversion.moves[0].moveId]);
          } else {
            listOfMovesP1.push(conversion.moves[0].moveId);
          }
        }
      }
      if (conversion.playerIndex === 1) {
        //This means player 2 got hit
        if (conversion.openingType === 'neutral-win') {
          if (masterMoves.hasOwnProperty(conversion.moves[0].moveId)) {
            listOfMovesP2.push(masterMoves[conversion.moves[0].moveId]);
          } else {
            listOfMovesP2.push(conversion.moves[0].moveId);
          }
        }
      }
    }

    //Append to body
    const myDiv = document.createElement('div');
    myDiv.style.textAlign = 'center';
    myDiv.innerHTML = `
    <h5>Analyzing match id: ${id}... where did we lose neutral?</h5>
    <p>Player1 (${player1}) should stop getting hit by </p><p>[${listOfMovesP1}]\n</p>
    <p>Player2 (${player2}) should stop getting hit by </p><p>[${listOfMovesP2}]\n</p>`;
    document.body.appendChild(myDiv);
    console.log(`Analyzing match id: ${id}`);
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{player1}</td>
      <td>{player2}</td>
      {/* <button className="btn btn-success mt-2">Edit</button> */}
      <button
        className="btn btn-success ml-2 mt-2"
        onClick={() => deleteMatch()}
      >
        Delete
      </button>
      <button className="btn btn-success ml-2 mt-2" onClick={() => analyze()}>
        Analyze Match
      </button>
    </tr>
  );
};

export default Items;
