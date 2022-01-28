import React, { MouseEventHandler, useEffect } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

import Web3 from 'web3';
import axios from 'axios';
import { AwsClient } from 'aws4fetch';
import MetaMaskOnboarding from '@metamask/onboarding';
import logo from '../logo.svg';
import { AuthContext } from '../context/AuthProvider';
import { AwsContext } from '../context/AwsProvider';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const web3 = new Web3(Web3.givenProvider);

enum AuthType {
  Login,
  Logout,
}

interface AuthButtonProps {
  authType: AuthType,
  children?: JSX.Element,
}

declare global {
  interface Window {
    ethereum: any;
  }
}

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

const AuthButton = (props: AuthButtonProps) => {
  const { dispatch } = React.useContext(AuthContext);
  const { awsClient, setAwsClient } = React.useContext(AwsContext);
  const [ submitted, setSubmitted ] = React.useState(false);

  const handleLogout = async () => {
    console.log('logging out')
    dispatch({
      type: 'LOGOUT',
    });
  }

  const handleLogin = async () => {
    if (!isMetaMaskInstalled()) {
      // TODO(mikechun): Show install metamask guideline
    }

    try {
      setSubmitted(true);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const address = accounts[0];
      
      const res = await window.fetch(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_GET_NONCE_PATH
        }?address=${address.toLowerCase()}`,
        {
          method: 'GET',
        }
      );

      let { nonce } = await res.json()

      // When user isn't registered on the server or is logged out
      if (!nonce) {
        const res = await window.fetch(
          `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_SIGNUP_PATH}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ address: address.toLowerCase() }),
          }
        );
        ({ nonce } = await res.json())
      }

      const signature = await web3.eth.personal.sign(
        String(web3.utils.sha3(`Welcome message, nonce: ${nonce}`)),
        address,
        '', 
      );

      const data = await (await window.fetch(
        `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_API_LOGIN_PATH}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            address,
            signature,
          }),
        }
      )).json()

      if (data.AccessKeyId) {
        console.log('dispatching')
        dispatch({
          type: 'LOGIN',
          payload: {
            isAuthenticated: true,
            accessKeyId: data.AccessKeyId,
            address,
            sessionToken: data.SessionToken,
            secretKey: data.SecretKey,
            expiration: data.Expiration,
          },
        });
        const aws = new AwsClient({
          accessKeyId: data.AccessKeyId,
          secretAccessKey: data.SecretKey,
          sessionToken: data.SessionToken,
          region: 'us-east-1',
          service: 'execute-api',
        });
        setAwsClient(aws);
      }
      else {
        throw Error('API failed');
      }
    }
    catch (error) {
      // TODO (mikechun): handle API errors from each await statement
      console.log(error);
      setSubmitted(false);
    }
  };

  switch (props.authType) {
    case AuthType.Login:
      if (submitted) {
        return <Button variant="outlined" color="primary" onClick={handleLogin}><Box component='span' sx={{visibility: 'hidden'}}>Login</Box><CircularProgress sx={{position: 'absolute'}}size={'1rem'}/></Button>
      }
      return <Button variant="outlined" color="primary" onClick={handleLogin}>Login</Button>
    case AuthType.Logout:
      return props.children && React.cloneElement(props.children, { onClick: handleLogout })
  }
  return null;
};

export { AuthButton, AuthType }