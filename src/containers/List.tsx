import React, { useEffect, useState } from "react";
import { useObservable } from "@ngneat/use-observable";
import { dataQuery, fetchData, dataState$ } from "../state/store";
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
  const [matches] = useObservable(dataQuery.selectAll());
  const [state] = useObservable(dataState$);
  const [fetched, setFetched] = useState(false);

  // ---------- Use Effect ----------
  useEffect(() => {
    if (!fetched && matches?.length === 0) {
      setFetched(true);
      fetchData();
    }
  }, [fetched]);

  // ---------- No Data ----------
  if (matches?.length === 0 && state !== "loading") {
    return (
      <div className="list">
        <div id="listComponent">No data available.</div>
      </div>
    );
  }

  // ---------- Return Data ----------
  const sortedData = Array.isArray(matches)
    ? [...matches].sort((a, b) => a.id - b.id)
    : [];
  return (
    <div className="table-container-custom">
      {state === "loading" && (
        <InlineLoading description={"Fetching data from database..."} />
      )}
      {state !== "loading" && (
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
