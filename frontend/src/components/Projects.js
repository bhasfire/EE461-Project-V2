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
import NumberInput from './NumberInput';
import Card from '@mui/material/Card';
import LogoffButton from '../components/LogoffButton';
import Box from '@mui/material/Box';

const drawerWidth = 240;

export default function PermanentDrawerLeft({onLogoff, updateHardwareQuantities}) {
  const [pid, setPID] = useState(0)
  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [textField, setTextField] = React.useState(0);
  //const [capacity, setCapacity] = useState(0);
  //const [availability, setAvailability] = useState(0);

  function getInputFromChild(input) {
    setTextField(input);
  }

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

      if (response.ok) {
        handleOpenSnackbar('Project Created Successfully'); // <-- Success message
        fetchProjectsWithId();
      } else {
        handleOpenSnackbar('Failed to Create Project');
      }
    } catch (error) {
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

  //----------------------------------------------------
  // Handle Project Selection & Update of Hardware QTY
  //----------------------------------------------------

  const fetchAndUpdateHardware = async (hardwareId) => {
    try {
      const response = await fetch('http://127.0.0.1:8001/project/gethardware', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hardware_id: hardwareId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Hardware data:', data);
  
        // Assuming you have methods or state hooks to update capacity and availability
        // For example:
        //setCapacity(data.capacity);
        //setAvailability(data.availability);
      } else {
        console.error('Failed to fetch hardware data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching hardware data:', error);
    }
  };


  const handleSetProject = async (project_id) => {
    setPID(project_id);
    localStorage.setItem('project', JSON.stringify(project_id));
    console.log("project set to id: " + JSON.stringify(project_id));
  
    try {
      const response = await fetch('http://127.0.0.1:8001/project/gethardwarequantities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: project_id }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Hardware quantities:', data);
  
        // Assuming you have a way to update the state of HW1_QTY and HW2_QTY in your components
        // For example:
        updateHardwareQuantities(data.hw1_qty, data.hw2_qty);
  
        // Optionally, fetch and update hardware details
        if (data.hw1_qty > 0) {
          fetchAndUpdateHardware(1); // For hardware_id 1
        }
        if (data.hw2_qty > 0) {
          fetchAndUpdateHardware(2); // For hardware_id 2
        }
      } else {
        console.error('Failed to fetch hardware quantities.');
      }
    } catch (error) {
      console.error('Error fetching hardware quantities:', error);
    }
  }
  

  const fetchProjectsWithId = async () => {
    try {
      // Retrieve the user data from local storage
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
    
      // Ensure that the user data and userID are available
      if (!user || !user.UserID) {
        console.error('User ID is not available. User must be logged in to join a project.');
        return;
      }
      const response = await fetch('http://127.0.0.1:8001/project/getprojectswithids', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user_id: user.UserID}),
      });
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
  
      const responseData = await response.json();
      console.log(responseData.success)
      if (response.ok && responseData.success) {
        console.log('Joined project successfully', responseData);
        // Trigger any state updates or user feedback here
        fetchProjectsWithId();
        handleOpenSnackbar(responseData.message);
      } else {
        console.error('Failed to join project:', responseData.message);
        // Display an error message to the user
        handleOpenSnackbar(responseData.message);
      }
    } catch (error) {
      console.error('Error while trying to join project:', error);
      // Handle network errors or other unexpected errors here
      // Example: handleOpenSnackbar('Error while trying to join project');
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
      <h3>Your Project List</h3>
      <Divider />
      <List>
        {projects.map((project) => (
          <ListItem 
            key={project.project_id} 
            disablePadding
            sx={{ 
              position: 'relative', 
              '&:hover .joinButton': { display: 'block' }, 
              backgroundColor: pid === project.project_id ? 'lightblue' : 'transparent'
            }}
          >
            <ListItemButton onClick={() => handleSetProject(project.project_id)}>
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
    
    
      <Card style={{backgroundColor: "white"}}>
      <div style={{ margin: '8px' }}>
        <NumberInput getInputFromChild={getInputFromChild} />
      </div>
      <Button
        variant="contained"
        sx={{ m: 1 }}
        onClick={() => joinProject(textField)}
      >
        Join Project
      </Button>
      
    </Card>
    <Button
        variant="contained"
        sx={{ m: 2 }}
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
      <div style={{
        position: 'absolute',
        bottom: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
        <LogoffButton onLogoff={onLogoff} /> {/* Pass onLogoff to LogoffButton */} 
      </div>
    </Drawer>
  );
}