import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; 
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export const Signin = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);  // State to track login failure

  const navigate = useNavigate();
  const switchForm = () => {
    navigate("/signup")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginFailed(false); // Reset the login failed state on new submission
    try {
      const response = await fetch('http://127.0.0.1:8001/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Sign in successful. User data:', data);
        if (data.UserID) {
          console.log('User ID:', data.UserID);
        } else {
          console.log('User ID not found in the response.');
        }
        props.onSignIn(true); // Set isAuthenticated to true
        localStorage.setItem('user', JSON.stringify(data)); // Save user data to local storage
        navigate("/dashboard"); // Navigate to dashboard after successful login
      } else {
        console.error('Login failed');
        setLoginFailed(true); // Set login failed to true
        props.onSignIn(false); // Set isAuthenticated to false
      }
    } catch (error) {
      console.error('Error logging in:', error);
      props.onSignIn(false); // Set isAuthenticated to false
    }
  }
  
  return (
    <div className="auth-form">
    <Typography variant="h5" component="h2" gutterBottom style={{ color: 'black' }}>
      Welcome to Hardware Checkout
    </Typography>
      <form className="signin-form" onSubmit={handleSubmit}>
        <Stack spacing={2}> 
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
            Log In!
          </Button>
          <Button variant="contained" onClick={() => switchForm('Signup')}>
            New user? Register here!
          </Button>
        </Stack>
      </form>
      
      {loginFailed && (
        <Typography color="error" gutterBottom>
          Login Failed
        </Typography>
      )}
    </div>
  )
}
