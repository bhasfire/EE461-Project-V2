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
import Box from '@mui/material/Box';

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const [projects, setProjects] = useState([]);

  // useEffect(() => {
  //   fetchProjects();
  // }, []);

  useEffect(() => {
    fetchProjectsWithId();
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

  const createNewProject = async () => {
    const projectName = prompt('Enter project name:');
    if (projectName) {
      try {
        const response = await fetch('http://localhost:8001/project/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: projectName }),
        });
        if (response.ok) {
          fetchProjects(); // Refetch projects after creating a new one
        } else {
          console.error('Failed to create project');
        }
      } catch (error) {
        console.error('Error creating project:', error);
      }
    }
  };

  const fetchProjectsWithId = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/project/getprojectswithids');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
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
      const response = await fetch('http://localhost:8001/project/join', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId, project_id: projectId }),
      });

      if (response.ok) {
          console.log('Joined project successfully');
          // Trigger any state updates or user feedback here
      } else {
          const errorData = await response.json(); // Assuming the backend sends back a JSON response
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
      <Button
        variant="contained"
        sx={{ m: 1 }}
        onClick={createNewProject}
      >
        Create New Project
      </Button>
    </Drawer>
  );
}