import React from 'react';
import Projects from '../components/Projects';
import HardwareList from '../components/HardwareList';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

function Dashboard( {onLogoff}) {
  return (
    <Grid container spacing={2}>
      <Grid xs={2.5}>
        <Projects onLogoff={onLogoff} />
      </Grid>
      <Grid xs={9}>
        <HardwareList />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
