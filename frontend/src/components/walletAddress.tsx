import React from 'react';
import Box from '@mui/material/Box';

interface WalletAddressProps {
  address: string;
}

const WalletAddress = (props:WalletAddressProps) => {
  const { address } = props;
  const shortAddress = `${address.slice(0, 6)}..${address.slice(-4)}`

  return <Box component="span">{shortAddress}</Box>
}

export { WalletAddress }
