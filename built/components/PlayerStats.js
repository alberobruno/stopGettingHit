"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@carbon/react");
var PlayerStats = function (props) {
    var playerMoves = props.playerMoves, p1MainPlayer = props.p1MainPlayer;
    var p1BeatenBy = playerMoves[0];
    var p2BeatenBy = playerMoves[1];
    // Add in moves that lost
    var movesPerformed = "To be added in future version";
    return (<>
      <h3 style={{ marginBottom: "25px" }}>When did you lose in neutral?</h3>
      <react_2.TableContainer>
        <react_2.Table>
          <react_2.TableHead>
            <react_2.TableRow>
              <react_2.TableCell>Moves you performed</react_2.TableCell>
              <react_2.TableCell>Beaten By</react_2.TableCell>
            </react_2.TableRow>
          </react_2.TableHead>
          <react_2.TableBody>
            {(p1MainPlayer ? p1BeatenBy : p2BeatenBy).map(function (move, i) { return (<react_2.TableRow key={i}>
                <react_2.TableCell>{move}</react_2.TableCell>
                <react_2.TableCell>{movesPerformed}</react_2.TableCell>
              </react_2.TableRow>); })}
          </react_2.TableBody>
        </react_2.Table>
      </react_2.TableContainer>
    </>);
};
exports.default = PlayerStats;
