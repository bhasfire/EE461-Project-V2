import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";

export const Signup = (props) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    } catch (error) {
      console.error('Error signing up:', error);
    }
  }
  
  const navigate = useNavigate();
  const switchForm = () => {
    navigate("/signin")
  }

  return (
    <div className="auth-form">
      <form className="signup-form" onSubmit={handleSubmit}>
        <TextField 
          label="First Name" 
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <TextField 
          label="Last Name" 
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <TextField 
          label="Email" 
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          variant="outlined" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />

        <Button variant="contained" type="submit">
          Sign Up!
        </Button>
      </form>

      <Button variant="contained" onClick={() => switchForm('Signin')}>
        Already have an account? Sign in here!
      </Button>
    </div>
  )
}