import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import CistercianLearn from './CistercianLearn';
import CistercianGame from './CistercianGame';
import NavBar from './NavBar';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
                <NavBar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/learn" element={<CistercianLearn />} />
                        <Route path="/play" element={<CistercianGame />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;