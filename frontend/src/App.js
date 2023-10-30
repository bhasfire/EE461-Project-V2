import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = (isSuccess) => {
    setIsAuthenticated(isSuccess);
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signin onSignIn={handleSignIn} />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
