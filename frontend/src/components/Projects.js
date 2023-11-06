import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StorageIcon from '@mui/icons-material/Storage';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Box from '@mui/material/Box';

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    fetchProjectsWithId();
  }, []);

//---------------------------------------------
// Create Project Dialog
//---------------------------------------------

  const handleCreateProjectDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmCreateProject = async () => {
    const apiUrl = 'http://127.0.0.1:8001/project/create';

    const payload = {
      projectId: projectId,
      projectName: projectName
    };

    console.log('Creating project with payload:', payload);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Handle the response
      if (response.ok) {
        const jsonResponse = await response.json();
        // Handle success
        fetchProjectsWithId();
      } else {
        // Handle server errors
        handleOpenSnackbar('Failed to Create Project');
      }
    } catch (error) {
      // Handle network errors
      handleOpenSnackbar('Failed to Create Project');
    }

    // Close the dialog and clear the form fields
    handleCloseDialog();
    setProjectId('');
    setProjectName('');
  };

  //---------------------------------------------
  // Create Project Error Message Snackbar
  //---------------------------------------------
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleOpenSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchProjectsWithId = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/project/getprojectswithids');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        console.log('Projects fetched with IDs:', data);
      } else {
        console.error('Failed to fetch projects with ID');
      }
    } catch (error) {
      console.error('Error fetching projects with ID:', error);
    }
  };
  
  const joinProject = async (projectId) => {
    // Retrieve the user data from local storage
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
  
    // Ensure that the user data and userID are available
    if (!user || !user.UserID) {
      console.error('User ID is not available. User must be logged in to join a project.');
      return;
    }
  
    // Use the userID from the stored user data
    const userId = user.UserID;
    console.log('Projects data:', projects);
    console.log('Attempting to join project with User ID:', userId, 'and Project ID:', projectId);
  
    try {
      const response = await fetch('http://127.0.0.1:8001/project/join', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId, project_id: projectId }),
      });

      if (response.ok) {
          console.log('Joined project successfully', await response.json());
          // Trigger any state updates or user feedback here
      } else {
          const errorData = await response.json(); // Assuming the backend sends back a JSON 
          console.error('Failed to join project with status:', response.status, await response.json());
          console.error('Failed to join project:', errorData.message);
          // Handle the display of error messages in the UI here
      }
  } catch (error) {
      console.error('Failed to join project:', error);
      // Handle network errors or other unexpected errors here
  }
};
  
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <h1>Projects</h1>
      <Divider />
      <List>
        {projects.map((project) => (
          <ListItem 
            key={project.project_id} 
            disablePadding
            sx={{ position: 'relative', '&:hover .joinButton': { display: 'block' } }}
          >
            <ListItemButton>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary={project.project_name} />
            </ListItemButton>
            <Box
              className="joinButton"
              sx={{
                display: 'none',
                position: 'absolute',
                right: 0,
                top: 0,
                height: '100%',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ height: '100%' }}
                onClick={() => joinProject(project.project_id)}
              >
                Join
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      message={snackbarMessage}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
      <Button
        variant="contained"
        sx={{ m: 1 }}
        onClick={handleCreateProjectDialog}
      >
        Create New Project
      </Button>
      
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new project, please enter a Project ID and a Project Name.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="project-id"
            label="Project ID"
            type="text"
            fullWidth
            variant="filled"
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
          />
          <TextField
            margin="dense"
            id="project-name"
            label="Project Name"
            type="text"
            fullWidth
            variant="filled"
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmCreateProject}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}