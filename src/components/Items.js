import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, TableRow, TableCell, IconButton } from "@carbon/react";
import { TrashCan } from "@carbon/icons-react";

const Items = function (props) {
  const { data, setData } = props;
  const { id, player1, player2 } = data;

  const deleteMatch = async () => {
    try {
      await axios.delete(`/delete/${id}`);
      const axiosGet = await axios.get("/getMatches");
      setData(axiosGet.data);
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
        />
      </TableCell>
    </TableRow>
  );
};

export default Items;
