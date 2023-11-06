import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import CapacityBar from './CapacityBar';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SubtractIcon from '@mui/icons-material/Remove';
import NumberInput from './NumberInput';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  value: 50,
}));

export default function AutoGrid(props) {
  const [textField, setTextField] = React.useState(0);
  function getInputFromChild(input) {
    setTextField(input);
  }

  const [availability, setAvailability] = React.useState(props.availability);
  function checkIn() {
    if (!isNaN(Number(textField)) && Number(textField) + availability <= props.capacity && Number(textField) + availability >= 0) {
      setAvailability(Number(textField) + availability);
    }
  }

  function checkOut() {
    if (!isNaN(Number(textField)) && availability - Number(textField) <= props.capacity && availability - Number(textField) >= 0) {
      setAvailability(availability - Number(textField));
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs>
          <Item>{props.name}</Item>
        </Grid>
        <Grid xs={8} display="flex" justifyContent="center" alignItems="center">
          <CapacityBar value={availability} capacity={props.capacity}/>
        </Grid>
        <Grid xs>
          <NumberInput getInputFromChild={getInputFromChild}/>
        </Grid>
        <Grid xs={0.5}>
          <IconButton color="success" onClick={checkIn}>
            <AddIcon />
          </IconButton>
        </Grid>
        <Grid xs={0.5}>
        <IconButton color="error" onClick={checkOut}>
            <SubtractIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}