import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <nav>
                <Link to="/">
                    <h1>⚛️ Text Processor</h1>
                </Link>
                <ul>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link
                                    to="/"
                                    className={location.pathname === '/' ? 'active' : ''}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/process"
                                    className={location.pathname === '/process' ? 'active' : ''}
                                >
                                    Process
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                    className={location.pathname === '/profile' ? 'active' : ''}
                                >
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <span>Welcome, {user?.name || 'User'}</span>
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};