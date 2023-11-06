import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Hardware from './Hardware';
import Box from '@mui/material/Box';

export default function BasicStack() {
  const [hardware, setHardware] = useState([]);

  useEffect(() => {
    getHardware();
  }, []);

  const getHardware = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/hardware/gethardware');
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        console.log(data['data'])
        setHardware(data['data'])
      }

      else {
        console.error('Failed to get hardware');
      }
    } catch (err) {
      console.error('Error getting hardware: ', err);
    }
  };
    
    return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          {hardware.map((hardware) => (
            <Hardware key={hardware.hardware_id} name={hardware.hardware_name} availability={hardware.availability} capacity={hardware.capacity}/>
          ))}
        </Stack>
      </Box>
    );
  }