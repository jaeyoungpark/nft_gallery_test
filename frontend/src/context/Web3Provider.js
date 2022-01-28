import React, { useState } from 'react';

export const Web3Context = React.useContext();

export const Web3Provider = (props) => {
  const [client, setClient] = useState();
  return (
    <Web3Context.Provider
      value={{
        client,
        setClient,
      }}
    >
        { props.children }
    </Web3Context.Provider>
  );
}