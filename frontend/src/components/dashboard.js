import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd'
import { AwsContext } from '../context/AwsProvider';
import Viewer from './viewer';

function Dashboard() {
  const { awsClient } = React.useContext(AwsContext);
  const [state, setState] = useState({ data: '' });
  const [showGallery, setGallery] = useState(false);

  useEffect(() => {
    const fetchHelloAPI = async () => {
      if (awsClient) {
        const request = await awsClient.sign(
          `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_HELLO_PATH}?name=there`,
          {
            method: 'GET',
          }
        );

        const response = await fetch(request);
        setState(await response.json());
      }
    };
    fetchHelloAPI();
  }, [awsClient]);

  async function savePhoto() {
  }

  function toggleGallery() {
    setGallery(!showGallery);
  }
  
  return (
    <div className='home'>
      <div className='content'>
        { !showGallery && <h1>{state.data}</h1> }
        { showGallery && <Viewer></Viewer> }
      </div>
    <Button style={button} type="primary" onClick={toggleGallery}>View Gallery</Button>
    </div>
  );
}

const button = { marginTop: 10 }

export default Dashboard;
