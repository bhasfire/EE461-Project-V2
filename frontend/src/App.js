import React, { useState } from "react";
import './styles/App.css';  // Updated path for CSS file
import { Signin } from './pages/Signin';  // Use curly braces for named exports
import { Signup } from './pages/Signup';  // Use curly braces for named exports

function App() {
  const [currentForm, setCurrentForm] = useState('signin');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
    <div className="App">
      {
        currentForm === "signin" ? <Signin onFormSwitch={toggleForm}/> : <Signup onFormSwitch={toggleForm}/>
      }
    </div>
  );
}

export default App;
