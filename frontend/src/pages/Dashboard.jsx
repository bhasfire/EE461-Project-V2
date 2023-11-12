import React, { useState, useEffect } from 'react';
import Projects from '../components/Projects';
import HardwareList from '../components/HardwareList';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom'; // assuming you're using react-router for navigation


function Dashboard({ onLogoff, hw1Qty, hw2Qty, updateHardwareQuantities}) {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const navigate = useNavigate();
  //const [currentProjectId, setCurrentProjectId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('./Signin'); // Redirect to login page if no user is stored
    }
  }, [navigate]);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user ? capitalizeFirstLetter(user['First Name']) : '';

  const [projectName, setProjectName] = useState('');
  const currentProjectId = localStorage.getItem('project');
  const isProjectSelected = currentProjectId !== null;

  useEffect(() => {
    // Fetch project name
    const fetchProjectName = async () => {
      if (currentProjectId) {
        try {
          const response = await fetch(`http://127.0.0.1:8001/project/getprojectname/${currentProjectId}`);
          if (response.ok) {
            const data = await response.json();
            setProjectName(data.projectName);
          } else {
            console.error('Failed to fetch project name.');
          }
        } catch (error) {
          console.error('Error fetching project name:', error);
        }
      }
    };

    fetchProjectName();
  }, [currentProjectId]);

  return (
    <div className="dashboard-container">
      <AppBar position="static" className="dashboard-appbar">
        <Toolbar>
          <Typography variant="h6" color="inherit" className="dashboard-title">
            Welcome to Your Resource Manager, {firstName}
          </Typography>
        </Toolbar>
      </AppBar>
    
      <Box display="flex" justifyContent="center" className="dashboard-content">
      <Grid container spacing={10}>
        <Grid item xs={3}> 
          <Projects
            onLogoff={onLogoff} 
            hw1Qty={hw1Qty} 
            hw2Qty={hw2Qty} 
            updateHardwareQuantities={updateHardwareQuantities}
            //setCurrentProjectId={setCurrentProjectId}
          />
        </Grid>
        <Grid item xs={9}> 
          {isProjectSelected && (
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center', 
                marginTop: 2,
                backgroundColor: 'white', // White background
                padding: '10px', // Adjust padding as needed
                borderRadius: '4px', // Rounded corners
                fontWeight: 'bold', // Bold font for the whole text
                color: '#2c455e', // Dark gray text
                border: '1px solid black', // Black border
              }}
            >
              You Have Selected: <span style={{ fontWeight: 'bold' }}>{projectName}</span>
            </Typography>
          )}
          <HardwareList currentProjectId={currentProjectId} />
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}

export default Dashboard;
