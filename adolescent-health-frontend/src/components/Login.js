import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Use a single CSS file for both components
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', { username, password });
            const token = response.data.token;
            setToken(token);
            localStorage.setItem('token', token);
            navigate('/dashboard'); // Redirect to the dashboard after successful login
        } catch (error) {
            setErrorMessage(error.response?.data.error || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="auth-button">Login</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>If new user, then <Link to="/register">Sign-up!</Link></p>
            </form>
        </div>
    );
};

export default Login;