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

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/project/getprojects');
      if (response.ok) {
        const data = await response.json();
        // const data = [
        //   { id: 1, name: 'Project 1' },
        //   { id: 2, name: 'Project 2' },
        //   { id: 3, name: 'Project 3' },
        // ];
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
