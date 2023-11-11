import Stack from '@mui/material/Stack';
import Hardware from './Hardware';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material/';

export default function BasicStack() {
  const currentProjectId = localStorage.getItem('project'); // Or use state management
  const isProjectSelected = currentProjectId !== null;
    return (
      <Box sx={{ width: '100%' , paddingTop: '200px' }}>
        {/* Message when no project is selected */}
      {!isProjectSelected && (
        <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2, color: "darkcyan" }}>
          Please select a project to enable check-in/out functionality.
        </Typography>
      )}
        <Stack spacing={2}>
          <Hardware name="HW Set1" hardware_id={1}/>
          <Hardware name="HW Set2" hardware_id={2}/>
        </Stack>
      </Box>
    );
  }