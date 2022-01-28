import React, { useState, useEffect, useContext } from 'react';
import { Avatar, Box, Container, Grid, ImageList, ImageListItem, InputLabel, TextField } from '@mui/material';
import { red } from '@mui/material/colors';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import pThrottle from 'p-throttle';

import { AuthContext } from '../context/AuthProvider';
import { ProfileSelector } from './profileSelector';

const Profile = () => {
  const { authState } = React.useContext(AuthContext);
  const [showProfileSelector, setShowProfileSelector] = React.useState(false);
  const { owner = 'mikechun', address } = authState;

  return (<Container maxWidth="xs">
    <Box
      component="form"
      noValidate
      sx={{
        '& .MuiTextField-root': { mb: 2 },
      }}
      autoComplete="off"
    >
      <TextField
        id="profile-wallet-address"
        fullWidth
        InputProps={{
          readOnly: true,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        label="Wallet Address"
        variant="standard"
        value={address}
      />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Avatar onClick={() => setShowProfileSelector(!showProfileSelector)} src='' sx={{ width: 160, height: 160, bgcolor: red[500] }} aria-label="recipe"></Avatar>
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="profile-name"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            label="Profile Name"
            variant="standard"
          />
        </Grid>
      </Grid>
      { showProfileSelector && <ProfileSelector></ProfileSelector>}
    </Box>
  </Container>);
}

export default Profile;
