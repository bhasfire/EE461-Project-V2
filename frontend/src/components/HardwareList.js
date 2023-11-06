import Stack from '@mui/material/Stack';
import Hardware from './Hardware';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';

export default function BasicStack() {
    return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          <Hardware name="HW Set1" hardware_id={1}/>
          <Hardware name="HW Set2" hardware_id={2}/>
        </Stack>
      </Box>
    );
  }