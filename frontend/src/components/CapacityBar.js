import * as React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress sx={{height: 15, borderRadius: 5}} variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
      <Typography variant="body2" color="text.primary" align="center" sx={{ color: 'black' }}>
        {`Available/Capacity: ${Math.round(props.availability)}/${Math.round(props.capacity)}`}
      </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function LinearDeterminate(props) {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={props.value * 100 / props.capacity} availability={props.value} capacity={props.capacity} />
    </Box>
  );
}