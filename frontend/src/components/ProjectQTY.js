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
  const [availability, setavailability] = React.useState(0);
  const [capacity, setcapacity] = React.useState(0);
  const [textField, setTextField] = React.useState(0);
  function getInputFromChild(input) {
    setTextField(input);
  }

  React.useEffect(() => {
    updateHardware();
  }, []);

  const updateHardware = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/project/gethardware', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({hardware_id: props.hardware_id}),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setcapacity(data["capacity"]);
        setavailability(data["availability"]);
        console.log('Hardware fetched:', data);
      } else {
        console.error('Failed to fetch hardware.');
      }
    } catch (error) {
      console.error('Error fetching hardware:', error);
    }
  }

  const setHardware = async (mode) => {
    if (!isNaN(Number(textField))) {
      try {
        const response = await fetch('http://127.0.0.1:8001/project/sethardware', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({hardware_id: props.hardware_id, set: Number(textField)*mode}),
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          console.log('Hardware set:', data);
          updateHardware()
        } else {
          console.error('Failed to set hardware.');
        }
      } catch (error) {
        console.error('Error setting hardware:', error);
      }
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs>
          <Item>{props.name}</Item>
        </Grid>
        <Grid xs={8} display="flex" justifyContent="center" alignItems="center">
          <CapacityBar value={availability} total={capacity}/>
        </Grid>
        <Grid xs>
          <NumberInput capacity={capacity} getInputFromChild={getInputFromChild}/>
        </Grid>
        <Grid xs={0.5}>
          <IconButton color="success" onClick={() => setHardware(1)}>
            <AddIcon />
          </IconButton>
        </Grid>
        <Grid xs={0.5}>
        <IconButton color="error" onClick={() => setHardware(-1)}>
            <SubtractIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}