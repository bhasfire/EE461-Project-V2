import Stack from '@mui/material/Stack';
import Hardware from './Hardware';
import Box from '@mui/material/Box';

export default function BasicStack() {
    return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          <Hardware name="HW1"/>
          <Hardware name="HW2"/>
          <Hardware name="HW3"/>
          <Hardware name="HW4"/>
          <Hardware name="HW5"/>
          <Hardware name="HW6"/>
        </Stack>
      </Box>
    );
  }