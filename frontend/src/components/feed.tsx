import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';

import { PostCard, PostCardProps } from './postcard';

const Feed = () => {
  const [postData, setPostData] = useState([1, 2, 3]);
  const [loading, setLoading] = useState(true);

  const data: PostCardProps = {
    owner: 'mikechun',
    ownerAddress: '0xeb834ae72b30866af20a6ce5440fa598bfad3a42',
    ownerProfileImageUrl: 'https://lh3.googleusercontent.com/fBhEUNV8zIyxV_YUrmm6cdMVabt435Dv7LABmGZiqlY28AAYzzPQaz5KxWgyiJdMDD1WmJvIvamzn7R1NvJy9V2-ZfDd_NqErbVC=s0', 
    // TODO (mikechun): delete below
    //ownerProfileImageUrl: '',
    collection: 'azuki', 
    likes: 5, 
    message: 'Hello NFT', 
    imageUrl: 'https://azuki-builder.s3.amazonaws.com/images/a0974ccf-3c90-4073-bf0e-834dfb77cbf0.png',
  };

  return (<Container maxWidth="sm">
    {postData.map(val => {
      return <PostCard {...data} sx={{ marginBottom: '25px' }}></PostCard>
    })}

  </Container>);
}

export default Feed;
