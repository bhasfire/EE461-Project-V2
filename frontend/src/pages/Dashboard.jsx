import React from 'react';
import Projects from '../components/Projects';
import HardwareList from '../components/HardwareList';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import LogoffButton from '../components/LogoffButton';

function Dashboard( {onLogoff}) {
  return (
    <Grid container spacing={2}>
      <Grid xs={2.5}>
        <Projects />
      </Grid>
      <Grid xs={9}>
        <HardwareList />
      </Grid>
      <Grid xs={12} style={{ textAlign: 'right', paddingRight: '20px', paddingTop: '10px'}}>
        <LogoffButton onLogoff={onLogoff} /> {/* Pass onLogoff to LogoffButton */}
      </Grid>
    </Grid>
  );
}

export default Dashboard;
