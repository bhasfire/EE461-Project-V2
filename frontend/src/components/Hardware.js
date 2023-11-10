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
  const [hw1_qty, sethw1_qty] = React.useState(0);
  const [hw2_qty, sethw2_qty] = React.useState(0);
  const [textField, setTextField] = React.useState(0);

  function getInputFromChild(input) {
    setTextField(input);
  }

  React.useEffect(() => {
    updateHardware();
    updateProject();
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

  const updateProject = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8001/project/getproject', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({project_id: localStorage.getItem('project')}),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        if(props.hardware_id == 1){
          sethw1_qty(data["hw1_qty"]);
        }else{
          sethw2_qty(data["hw2_qty"]);
        }
        console.log('Project fetched:', data);
      } else {
        console.error('Failed to fetch project.');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
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
          body: JSON.stringify({project_id: localStorage.getItem('project'), hardware_id: props.hardware_id, set: Number(textField)*mode}),
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          console.log('Hardware set:', data);
          updateProject();
          updateHardware();
        } else {
          console.error('Failed to set hardware.');
        }
      } catch (error) {
        console.error('Error setting hardware:', error);
      }
    }
  }

  let inventory;
  if(props.hardware_id == 1){
    inventory = <Item>{`Current Project HW1_QTY: ${hw1_qty}`}</Item>
  }else{
    inventory = <Item>{`Current Project HW2_QTY: ${hw2_qty}`}</Item>
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs={3}>
          {inventory}
        </Grid>
        <Grid xs={2}>
          <Item>{props.name}</Item>
        </Grid>
        <Grid xs={4.5} display="flex" justifyContent="center" alignItems="center">
          <CapacityBar value={100*availability/capacity} availability={availability} capacity={capacity}/>
        </Grid>
        <Grid xs={1.5}>
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