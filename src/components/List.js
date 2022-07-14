import React, { useEffect, useState } from 'react';

//Components
import Items from './Items';

const List = function (props) {
  //Make sure I have access to data
  const { data } = props;
  console.log('List Props data: ', data);

  //For each body, loop through data and populate
  const rows = [];

  for (let i = 0; i < data.length; i++) {
    rows.push(<Items data={data[i]} key={i} />);
  }
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}
    >
      <div id="listComponent" style={{ width: '1000px' }}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id </th>
              <th>Player 1</th>
              <th>Player 2</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
