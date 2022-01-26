import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';

import PostCard from './postcard';

const Feed = () => {
  const [postData, setPostData] = useState([1,2,3]);
  const [loading, setLoading] = useState(true);

  const data = {owner: 'Michael', ownerProfile: 'somepath', collection: 'cool cats', likes: 5, message: 'hello world' };

  return (<Container maxWidth="sm">
      {postData.map(val => {
          return <PostCard {...data} sx={{marginBottom: '25px'}}></PostCard>
      })}

  </Container>);
}

export default Feed;
