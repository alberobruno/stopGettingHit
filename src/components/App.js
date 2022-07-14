import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Components
import List from './List';

const App = () => {
  //Set State
  const [data, setData] = useState();
  // const [open, setOpen] = useState(false);

  //Fetch matches table from backend
  useEffect(() => {
    const fetchData = async () => {
      const axiosGet = await axios.get('/getMatches');
      setData(axiosGet.data);
      console.log('Fetched DB: ', axiosGet.data);
    };
    const database = fetchData();
  }, []);

  // const test = () => {
  //   setOpen(!open);
  // };

  if (data) {
    return (
      <div>
        <h1 className="text-center mt-5">Stop Getting Hit</h1>
        <div id="list">
          {/* <button onClick={() => test()}>Hello</button>
        {open && <p>Hello</p>} */}
          <List data={data} />
        </div>
      </div>
    );
  }
};

export default App;
