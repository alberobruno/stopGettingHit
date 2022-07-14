import React, { useEffect, useState } from 'react';

const Items = function (props) {
  //Make sure I have access to data
  const { data } = props;
  const { id, player1, player2 } = data;
  console.log('Items Props data: ', data);

  return (
    <tr>
      <td>{id}</td>
      <td>{player1}</td>
      <td>{player2}</td>
      <button className="btn btn-success">Edit</button>
    </tr>
  );
};

export default Items;
