import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './styles/App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          input: {
            color: 'black', // Change text color
          },
          '& label': {
            color: 'gray', // Change label color
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black', // Change border color
            },
            '&:hover fieldset': {
              borderColor: 'black', // Change border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: 'black', // Change border color when focused
            },
          },
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = (isSuccess) => {
    setIsAuthenticated(isSuccess);
  }

  const handleLogoff = async () => {
    try {
      const response = await fetch('http://localhost:8001/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add any necessary headers, such as authorization tokens, here
      });
  
      if (response.ok) {
        setIsAuthenticated(false);
      } else {
        console.error('Logoff failed', await response.text());
      }
    } catch (error) {
      console.error('Logoff error', error);
    }
  };
  

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signin onSignIn={handleSignIn} />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogoff={handleLogoff} /> : <Navigate to="/signin" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
