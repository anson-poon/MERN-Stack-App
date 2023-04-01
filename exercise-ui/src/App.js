import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateExercisePage from './pages/CreateExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import Navigation from './components/Navigation';
import { useState } from 'react';

function App() {

  const[exerciseToEdit, setExerciseToEdit] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>|EXERCISE LOGGER|</h1>
        <p>Full Stack MERN App Demo</p>
        <Router>
        <Navigation />
          <Routes>
              <Route path="/" element={<HomePage setExerciseToEdit={setExerciseToEdit}/>}/>
              <Route path="/create-exercise" element={<CreateExercisePage />}/>
              <Route path="/edit-exercise" element={ <EditExercisePage exerciseToEdit={exerciseToEdit}/>}/>
          </Routes>
        </Router>
      </header>
      <footer>© 2023 Kee Ching Poon </footer>
    </div>
  );
}

export default App;