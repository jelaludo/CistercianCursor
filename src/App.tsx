import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import CistercianNumeral from './CistercianNumeral';
import Learn from './Learn';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <Link to="/learn" className="nav-button">Learn</Link>
          <Link to="/" className="nav-button">Home</Link>
          <Link to="/play" className="nav-button">Play</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CistercianNumeral />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/play" element={<div>Play page (coming soon)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
