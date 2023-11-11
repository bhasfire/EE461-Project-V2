import React, { useState } from 'react';
import Projects from '../components/Projects';
import HardwareList from '../components/HardwareList';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';


function Dashboard({ onLogoff, hw1Qty, hw2Qty, updateHardwareQuantities}) {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const [currentProjectId, setCurrentProjectId] = useState(null);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user ? capitalizeFirstLetter(user['First Name']) : '';

  return (
    <div className="dashboard-container">
      <AppBar position="static" className="dashboard-appbar">
        <Toolbar>
          <Typography variant="h6" color="inherit" className="dashboard-title">
            Welcome to Your Dashboard, {firstName}
          </Typography>
        </Toolbar>
      </AppBar>
    
      <Box display="flex" justifyContent="center" className="dashboard-content">
      <Grid container spacing={10}>
        <Grid item xs={3}> {/* Adjust if needed */}
          <Projects
            onLogoff={onLogoff} 
            hw1Qty={hw1Qty} 
            hw2Qty={hw2Qty} 
            updateHardwareQuantities={updateHardwareQuantities}
            setCurrentProjectId={setCurrentProjectId}
          />
        </Grid>
        <Grid item xs={9}> {/* Adjust if needed */}
          <HardwareList currentProjectId={currentProjectId} />
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}

export default Dashboard;
