import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
    const location = useLocation();

    return (
        <nav className="nav-bar">
            <Link to="/learn" className={`nav-link ${location.pathname === '/learn' ? 'active' : ''}`}>
                <span className="icon">📚</span>
                <span className="label">Learn</span>
            </Link>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <span className="icon">🏠</span>
                <span className="label">Home</span>
            </Link>
            <Link to="/play" className={`nav-link ${location.pathname === '/play' ? 'active' : ''}`}>
                <span className="icon">🎮</span>
                <span className="label">Play</span>
            </Link>
        </nav>
    );
};

export default NavBar;