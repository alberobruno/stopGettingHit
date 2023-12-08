import React from "react";
import { Link } from "react-router-dom";
import { Button, TableRow, TableCell, IconButton } from "@carbon/react";
import { TrashCan } from "@carbon/icons-react";
import { deletePolicy } from "../state/store";

const Items = function (props) {
  const { data } = props;
  const { id, player1, player2 } = data;

  const deleteMatch = async () => {
    try {
      await deletePolicy(id);
    } catch (e) {
      console.error("Deletion Error...");
      console.error(e);
    }
  };

  return (
    <TableRow>
      <TableCell>{id}</TableCell>
      <TableCell>{player1}</TableCell>
      <TableCell>{player2}</TableCell>
      <TableCell>
        <Link
          to={"/analysis"}
          state={{ data: data, id: id, player1: player1, player2: player2 }}
        >
          <Button kind="tertiary">Analyze Match</Button>
        </Link>
      </TableCell>
      <TableCell>
        <IconButton
          renderIcon={TrashCan}
          iconDescription={`Delete Match ${id}`}
          onClick={() => deleteMatch()}
          hasIconOnly
          label={`Delete Match ${id}`}
        />
      </TableCell>
    </TableRow>
  );
};

export default Items;
