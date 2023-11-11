import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


export const Signup = (props) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Can be 'success', 'error', etc.


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setSnackbarMessage('Account created successfully!');
        setSnackbarSeverity('success');
        // Redirect or perform any other action upon successful signup
      } else {
        setSnackbarMessage(data.message || 'Failed to create account');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error signing up:', error);
      setSnackbarMessage('Error signing up');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }
  
  const navigate = useNavigate();
  const switchForm = () => {
    navigate("/signin")
  }

  return (
    <div className="auth-form">
      <Typography variant="h5" component="h2" gutterBottom style={{ color: 'black' }}>
        Create a New Account
      </Typography>
      <form className="signup-form" onSubmit={handleSubmit}>
        <Stack spacing={2}> 
          <TextField 
            label="First Name" 
            id="filled-required"
            variant="filled"
            style={{backgroundColor: 'lightblue'}}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextField 
            label="Last Name" 
            id="filled-required"
            variant="filled"
            style={{backgroundColor: 'lightblue'}}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <TextField 
            label="Email" 
            id="filled-required"
            variant="filled"
            style={{backgroundColor: 'lightblue'}}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            id="filled-required"
            variant="filled"
            style={{backgroundColor: 'lightblue'}} 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />

          <Button variant="contained" type="submit">
            Sign Up!
          </Button>
          <Button variant="contained" onClick={() => switchForm('Signin')}>
            Already have an account? Sign in here!
          </Button>
        </Stack> 
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
    </Snackbar>
      
    </div>
  )
}