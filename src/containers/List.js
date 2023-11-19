import React, { useEffect, useState, useContext } from "react";
import { DataContext } from "../contexts/DataContext";
import axios from "axios";
import Items from "../components/Items";
import "../styles.scss";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@carbon/react";

const List = function () {
  const { receivedData, setReceivedData } = useContext(DataContext);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched) {
      setFetched(true);
      const fetchData = async () => {
        const axiosGet = await axios.get("/getMatches");
        setReceivedData(axiosGet.data);
      };
      fetchData();
    }
  }, []);

  if (receivedData) {
    const data = receivedData.sort((a, b) => a.id - b.id);

    return (
      <div className="table-container-custom">
        <TableContainer title="Matches">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Player 1</TableCell>
                <TableCell>Player 2</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, i) => (
                <Items data={row} setData={setReceivedData} key={i} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } else {
    return (
      <div className="list">
        <div id="listComponent">
          <span>Fetching data from database...</span>
          <br></br>
          <span>(May take up to 10 secs)</span>
        </div>
      </div>
    );
  }
};

export default List;
