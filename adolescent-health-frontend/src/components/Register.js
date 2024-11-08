import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Use the same CSS file
import { Link } from 'react-router-dom'; // Import useNavigate

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/register', { username, password, role });
            alert('User registered successfully!');
            // Optionally redirect or clear fields
        } catch (error) {
            setErrorMessage(error.response?.data.error || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} required />
                <button type="submit" className="auth-button">Register</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>If existing user, then <Link to="/">Sign-in!</Link></p>
            </form>
        </div>
    );
};

export default Register;