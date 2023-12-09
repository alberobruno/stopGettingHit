import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@carbon/react';

// interface PlayerStatsProps {
//   playerMoves: any;
//   p1MainPlayer: boolean;
// }

export default function PlayerStats({ playerMoves, p1MainPlayer }) {
  console.log('PlayerMoves: ', playerMoves);
  console.log('p1MainPlayer: ', p1MainPlayer);

  const p1BeatenBy = playerMoves[0];
  const p2BeatenBy = playerMoves[1];

  // Add in moves that lost
  const movesPerformed = 'To be added in future version';

  return (
    <>
      <h3 style={{ marginBottom: '25px' }}>When did you lose in neutral?</h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Moves you performed</TableCell>
              <TableCell>Beaten By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(p1MainPlayer ? p1BeatenBy : p2BeatenBy).map((move, i) => (
              <TableRow key={i}>
                <TableCell>{move}</TableCell>
                <TableCell>{movesPerformed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
