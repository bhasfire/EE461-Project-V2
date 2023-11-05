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


const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/project/getprojects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

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
        fetchProjects();
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
          <ListItem key={project.id} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary={project.project_name} />
            </ListItemButton>
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
