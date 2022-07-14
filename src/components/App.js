import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Components
import List from './List';

const App = () => {
  const [open, setOpen] = useState(false);

  const test = () => {
    setOpen(!open);
    console.log(open);
  };

  useEffect(() => {
    const fetchData = async () => {
      const axiosGet = await axios.get('/getMatches');
      console.log(axiosGet);
      return axiosGet;
    };
    const data = fetchData();
  });

  return (
    <div>
      <h1 className="text-center mt-5">Stop Getting Hit</h1>
      <div id="list">
        {open && <p>Hello</p>}
        <button onClick={() => test()}>Hello</button>
        <List />
      </div>
    </div>
  );
};

export default App;
