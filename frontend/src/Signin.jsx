import React, { useState } from "react";
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField'; 

export const Signin = (props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8001/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }
  

  return (
    <div className="auth-form">
      <form className="signin-form" onSubmit={handleSubmit}>
        
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
          Log In!
        </Button>
      </form>

      <Button variant="contained" onClick={() => props.onFormSwitch('Signup')}>
        If you don't already have an account, register here!
      </Button>
    </div>
  )
}