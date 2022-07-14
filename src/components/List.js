import React from 'react';

const List = function () {
  //Make sure I have access to data

  //For each body, loop through data and populate

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}
    >
      <div id="listComponent" style={{ width: '1000px' }}>
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Player 1</th>
              <th>Player 2</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>john@example.com</td>
              <button className="btn btn-success">Edit</button>
            </tr>
            <tr>
              <td>Mary</td>
              <td>Moe</td>
              <td>mary@example.com</td>
              <button className="btn btn-success">Edit</button>
            </tr>
            <tr>
              <td>July</td>
              <td>Dooley</td>
              <td>july@example.com</td>
              <button className="btn btn-success">Edit</button>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
