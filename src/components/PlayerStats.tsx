import * as React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@carbon/react';

interface PlayerStatsProps {
  playerMoves: string[][];
  p1MainPlayer: boolean;
}

export default function PlayerStats({
  playerMoves,
  p1MainPlayer,
}: PlayerStatsProps) {
  const p1BeatenBy = playerMoves[0];
  const p2BeatenBy = playerMoves[1];
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
              <React.Fragment key={i}>
                <TableRow>
                  <TableCell>{move}</TableCell>
                  <TableCell>{movesPerformed}</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
