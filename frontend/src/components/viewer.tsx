import React, { useState, useEffect } from 'react';
import pThrottle from 'p-throttle';
// import logo from './logo.svg';
// import './App.css';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { AuthContext } from '../context/AuthProvider';

const API_KEY = 'U42YTQClHQMz1dRyy087pHijX8I2-VTC';

declare global {
  interface Window {
    ethereum: any;
  }
}

//dummy wallet address = 0xeb834ae72b30866af20a6ce5440fa598bfad3a42;

const web3 = createAlchemyWeb3(
  `wss://eth-mainnet.ws.alchemyapi.io/ws/${API_KEY}`,
);
const now = Date.now();
const throttle:any = pThrottle({
  limit: 5,
  interval: 1000
});

function App() {
  const { authState } = React.useContext(AuthContext);
  const [address, setAddress] = useState(authState.address);
  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    console.log('useEffect');
    console.log(address);
    if (address.length == '0xeb834ae72b30866af20a6ce5440fa598bfad3a42'.length) {
      console.log("lookup nfts")
      lookupNFT(address);
      setNfts([]);
    }
  },[address]);

  const lookupNFT = async (address:string) => { 
    setLoading(true);
    const response = await fetch(`https://eth-mainnet.g.alchemy.com/${API_KEY}/v1/getNFTs/?owner=${address}`);
    const data = await response.json();
    const res = [];
    setLoading(false);

    for (let i=0; i < data.ownedNfts.length; i++) {
      const val = data.ownedNfts[i];
      const address = val.contract.address;
      const tokenId = val.id.tokenId;
      getNftMeta(address, tokenId)
      .then((meta:any) => {
        setNfts(prevValues => [...prevValues, meta])
      })
    }
  } 

  const getNftMeta = async (address:string, tokenId: string) => {
    const throttled = throttle(fetch);

    const response = await throttled(`https://eth-mainnet.g.alchemy.com/${API_KEY}/v1/getNFTMetadata?contractAddress=${address}&tokenId=${tokenId}&tokenType=erc721`);
    return response.json();
  }

  const handleAddressChange = (e:React.FormEvent<HTMLInputElement>)=> {
    const val = e.currentTarget.value.trim(); 
    setAddress(val);
  }

  const handleConnect = (evt:any) => {
    console.log('connect');
    //web3.eth.requestAccounts();
    if (window.ethereum) {
      window.ethereum
        .enable()
        .then((accounts:any) => {
          // Metamask is ready to go!
          setAddress(accounts[0]);
        })
        .catch((reason:any) => {
          // Handle error. Likely the user rejected the login.
        });
    } else {
      // The user doesn't have Metamask installed.
    }
  }

  const renderNft = (nft:any) => {
    let dataJson:any = {};
    const nftData:any = {};

    if ('name' in nft) {
      nftData['name'] = nft['name'];
    }

    if ('metadata' in nft) {
      const imageUrl = nft['metadata']['image'];

      if (!imageUrl) return <div className='renderError'>Not supported: {JSON.stringify(nft)}</div>;

      if (imageUrl.startsWith('ipfs://')) {
        nftData['image'] = `https://ipfs.io/ipfs/${imageUrl.split('//')[1]}`;
      }
      else {
        nftData['image'] = imageUrl;
      }
      
    }
    else if ('externalDomainViewUrl' in nft) {
      
      const [_, data] = nft['externalDomainViewUrl'].split(',');

      if (!data) return <div className='renderError'>Not supported: {JSON.stringify(nft)}</div>;

      const dataJson = JSON.parse(atob(data));
      nftData['image'] = dataJson['image'];

    }
    return <div><div>Name: { dataJson['name'] }</div><div><img className='nftImage' src={nftData['image']} /></div></div>;
  };

  console.log('state:');
  console.log(authState);
  return (
    <div className="App">
      <header className="App-header">
        <h6>Enter your NFT address below</h6>
        <input type="text" value={address} onChange={handleAddressChange} />
        <h6>or connect your wallet</h6>
        <button onClick={handleConnect}>Connect</button>
        { loading && <p>Loading..</p> }
        { nfts.map(nft => {
            return renderNft(nft);
          })
        }
      </header>
    </div>
  );
}


export default App;
