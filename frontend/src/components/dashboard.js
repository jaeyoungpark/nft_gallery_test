import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd'
import { AwsContext } from '../context/AwsProvider';

function Dashboard() {
  const { awsClient } = React.useContext(AwsContext);
  const [state, setState] = useState({ data: '' });

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
  
  return (
    <div className='home'>
      <div className='content'>
        <h1>{state.data}</h1>        
      </div>
    <Button style={button} type="primary" onClick={savePhoto}>View Gallery</Button>
    </div>
  );
}

const button = { marginTop: 10 }

export default Dashboard;
