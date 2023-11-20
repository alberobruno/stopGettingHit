import React, { useEffect, useState } from "react";
import { dataObservable, fetchData } from "../state/store";
import Items from "../components/Items";
import "../styles.scss";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  InlineLoading,
} from "@carbon/react";

const List = () => {
  // ---------- State management ----------
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // ---------- Use Effect ----------
  useEffect(() => {
    const subscription = dataObservable.subscribe((state) => {
      setData(state.data);
      setLoading(state.loading);
    });
    if (!fetched) {
      setFetched(true);
      fetchData();
    }
    return () => subscription.unsubscribe();
  }, []);

  // ---------- No Data ----------
  if (data?.length === 0 && !loading) {
    return (
      <div className="list">
        <div id="listComponent">No data available.</div>
      </div>
    );
  }

  // ---------- Return Data ----------
  const sortedData = Array.isArray(data)
    ? [...data].sort((a, b) => a.id - b.id)
    : [];
  return (
    <div className="table-container-custom">
      {loading && (
        <InlineLoading description={"Fetching data from database..."} />
      )}
      {!loading && (
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
              {sortedData.map((row, i) => (
                <Items data={row} key={i} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default List;
