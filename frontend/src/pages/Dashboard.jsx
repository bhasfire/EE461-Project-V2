import React, { useState } from 'react';
import Projects from '../components/Projects';
import HardwareList from '../components/HardwareList';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

function Dashboard({ onLogoff, hw1Qty, hw2Qty, updateHardwareQuantities}) {
  const [currentProjectId, setCurrentProjectId] = useState(null);

  return (
    <Grid container spacing={2}>
      <Grid xs={2.5}>
        <Projects
          onLogoff={onLogoff} 
          hw1Qty={hw1Qty} 
          hw2Qty={hw2Qty} 
          updateHardwareQuantities={updateHardwareQuantities}
          setCurrentProjectId={setCurrentProjectId} // Passing the function to set the current project ID
        />
      </Grid>
      <Grid xs={9}>
        <HardwareList currentProjectId={currentProjectId} /> 
      </Grid>
    </Grid>
  );
}

export default Dashboard;
