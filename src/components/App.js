import React, { useEffect, useState } from 'react';
import axios from 'axios';

//Components
import List from './List';

const App = () => {
  //Set State
  const [data, setData] = useState();

  //Fetch matches table from backend
  useEffect(() => {
    const fetchData = async () => {
      const axiosGet = await axios.get('/getMatches');
      setData(axiosGet.data);
      console.log('Fetched DB: ', axiosGet.data);
    };
    const grab = fetchData();
  }, []);

  //Upload Button Functionality
  const upload = async () => {
    const inputData = $('#uploadInput')[0].value;
    try {
      const json = await JSON.parse(inputData);
      console.log('Input Accepted');
      const fetchData = async () => {
        const axiosPost = await axios.post('/upload', json);
        const axiosGet = await axios.get('/getMatches');
        setData(axiosGet.data);
        document.getElementById('uploadInput').value = '';
      };
      const grab = fetchData();
    } catch (e) {
      console.log('Invalid input: Must be JSON');
    }
  };

  //Reload Button Functionality
  const reloadPage = () => window.location.reload();

  //If data exists - render the page
  if (data) {
    return (
      <div>
        <h1 className="text-center mt-5">Stop Getting Hit</h1>
        <div id="list">
          {/* <button onClick={() => test()}>Hello</button>
          {open && <p>Hello</p>} */}
          <div
            className="mt-5"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div
              id="dropzone"
              // onDrop={dropHandler(event)}
              // onDragOver={dragOverHandler(event)}
              style={{
                border: '5px solid blue',
                width: '200px',
                height: '100px',
              }}
            >
              <p>
                Drag one or more files to this <i>drop zone</i>.
              </p>
            </div>
            <input
              type="text"
              style={{
                width: '700px',
                border: '2px solid rgb(222, 226, 230)',
                borderRadius: '6px',
              }}
              id="uploadInput"
            />
            <button className="btn btn-success ml-2" onClick={() => upload()}>
              Upload Match JSON
            </button>
            <button
              className="btn btn-success ml-2 mt-2"
              onClick={() => reloadPage()}
            >
              Reload Page
            </button>
          </div>
          <List data={data} setData={setData} />
        </div>
      </div>
    );
  }
};

export default App;
