import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './Home';
import CistercianNumeral from './CistercianNumeral';
import CistercianGame from './CistercianGame';
import CistercianLearn from './CistercianLearn';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<CistercianLearn />} />
          <Route path="/play" element={<CistercianGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;