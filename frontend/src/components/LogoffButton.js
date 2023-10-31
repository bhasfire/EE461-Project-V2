import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function LogoffButton({ onLogoff }) {  // Accept onLogoff as a prop
  const navigate = useNavigate();

  const handleLogoff = async () => {
    console.log("Logoff button clicked");
    if (onLogoff) {
      console.log("Calling onLogoff");
      await onLogoff();
    } else {
      console.log("onLogoff is not defined");
    }
  
    navigate('/signin');
  };
  

  return (
    <Button variant="contained" onClick={handleLogoff}>
      Logoff
    </Button>
  );
}

export default LogoffButton;
