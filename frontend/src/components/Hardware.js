import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import CapacityBar from './CapacityBar';
import NumberInput from './NumberInput';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';


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
  const currentProjectId = localStorage.getItem('project');
  const isProjectSelected = currentProjectId !== null;

  function getInputFromChild(input) {
    setTextField(input);
  }
  
  React.useEffect(() => {
    updateHardware();
    updateProject();
}, [localStorage.getItem('project')]); // Dependency on currentProjectId


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
        if(props.hardware_id === 1){
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
  if(props.hardware_id === 1){
    inventory = <Item>{`HW1 QUANTITY: ${hw1_qty}`}</Item>
  }else{
    inventory = <Item>{`HW2 Quantity: ${hw2_qty}`}</Item>
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Existing Grid items */}
        <Grid item xs={2.5}>
          {inventory}
        </Grid>
        <Grid item xs={1.5}>
          <Item>{props.name}</Item>
        </Grid>
        <Grid item xs={4.75}>
          <CapacityBar value={100*availability/capacity} availability={availability} capacity={capacity}/>
        </Grid>
        <Grid item xs={1.25}>
          <NumberInput capacity={capacity} getInputFromChild={getInputFromChild}/>
        </Grid>
        <Grid item xs={1} display="flex" justifyContent="flex-end" pr={1}>
          <Button 
            variant="contained" 
            color="success" 
            onClick={() => setHardware(1)}
            disabled={!isProjectSelected} // Disable if no project is selected
            sx={{ fontSize: '0.7rem', backgroundColor: !isProjectSelected ? '#ccc' : '#fff' }}
          >
            Checkin
          </Button>
        </Grid>
        <Grid item xs={0.5} display="flex" justifyContent="flex-start">
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => setHardware(-1)}
            disabled={!isProjectSelected} // Disable if no project is selected
            sx={{ fontSize: '0.7rem', backgroundColor: !isProjectSelected ? '#ccc' : '#fff', color: 'black' }}
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}