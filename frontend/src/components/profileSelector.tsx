import React, { useState, useEffect, useContext } from 'react';
import { Avatar, Box, Container, Grid, ImageList, ImageListItem, InputLabel, TextField } from '@mui/material';
import { red } from '@mui/material/colors';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import pThrottle from 'p-throttle';

import { AuthContext } from '../context/AuthProvider';

const web3 = createAlchemyWeb3(
  `wss://eth-mainnet.ws.alchemyapi.io/ws/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
);

export const ProfileSelector = () => {
  const { authState: { address } } = useContext(AuthContext)
  const [ nftCollection, setNftCollection ] = useState<any[]>([])

  useEffect(() => {
    const throttle:any = pThrottle({
      limit: 10,
      interval: 1000
    });
    const throttled = throttle(fetch);

    async function getNftMetadata(address:string, tokenId: string) {
      const res = await throttled(`https://eth-mainnet.g.alchemy.com/${process.env.REACT_APP_ALCHEMY_API_KEY}/v1/getNFTMetadata?contractAddress=${address}&tokenId=${tokenId}&tokenType=erc721`);
      return res.json();
    }

    async function getNFTcollection(address:string) {
      const res = await throttled(`https://eth-mainnet.g.alchemy.com/${process.env.REACT_APP_ALCHEMY_API_KEY}/v1/getNFTs/?owner=${address}`);
      const data = await res.json();

      for (let i=0; i < data.ownedNfts.length; i++) {
        const val = data.ownedNfts[i];
        const address = val.contract.address;
        const tokenId = val.id.tokenId;

        getNftMetadata(address, tokenId)
        .then((meta:any) => {
          setNftCollection((prevValues) => {
            return [...prevValues, meta]
          })
        })
      }
    }
    getNFTcollection('0xeb834ae72b30866af20a6ce5440fa598bfad3a42')

  },[address])

  const data = [
    'https://azuki-builder.s3.amazonaws.com/images/a0974ccf-3c90-4073-bf0e-834dfb77cbf0.png',
    'https://azuki-builder.s3.amazonaws.com/images/a0974ccf-3c90-4073-bf0e-834dfb77cbf0.png',
    'https://azuki-builder.s3.amazonaws.com/images/a0974ccf-3c90-4073-bf0e-834dfb77cbf0.png',
    'https://azuki-builder.s3.amazonaws.com/images/a0974ccf-3c90-4073-bf0e-834dfb77cbf0.png',
    'https://azuki-builder.s3.amazonaws.com/images/a0974ccf-3c90-4073-bf0e-834dfb77cbf0.png',
    'https://azuki-builder.s3.amazonaws.com/images/a0974ccf-3c90-4073-bf0e-834dfb77cbf0.png',
  ]

  return <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
  {data.map((item, idx) => (
    <ImageListItem key={idx}>
      <img
        src={`${item}?w=164&h=164&fit=crop&auto=format`}
        srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
        alt={item}
        loading="lazy"
      />
    </ImageListItem>
  ))}
  </ImageList>
}