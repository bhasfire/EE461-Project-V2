import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {Signin} from './pages/Signin';
import {Signup} from './pages/Signup';
import Projects from './components/Projects';
import HardwareList from './components/HardwareList';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import './styles/App.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = (isSuccess) => {
    setIsAuthenticated(isSuccess);
  }

  const renderDashboard = () => (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid xs={2.5}>
          <Projects />
        </Grid>
        <Grid xs={9}>
          <HardwareList />
        </Grid>
      </Grid>
    </ThemeProvider>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signin onSignIn={handleSignIn} />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard" element={isAuthenticated ? renderDashboard() : <Navigate to="/signin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
