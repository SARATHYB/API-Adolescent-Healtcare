import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ setToken, token }) => {
    const [healthData, setHealthData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userName, setuserName] = useState('');
    const [reminders, setReminders] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    // Fetch health data
    useEffect(() => {
        const fetchHealthData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHealthData(response.data.healthData);
                setUserId(response.data.userId);
                setuserName(response.data.userName);
            } catch (error) {
                console.error('Failed to fetch health data:', error);
            }
        };

        fetchHealthData();
    }, [token]);

    // Fetch appointment reminders
    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/appointments/reminders', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReminders(response.data.reminders);
                setErrorMessage('');
            } catch (error) {
                console.error('Failed to fetch reminders:', error);
                setErrorMessage(error.response?.data.error || 'Failed to fetch reminders');
            }
        };

        fetchReminders();
    }, [token]);

    return (
        <div className="dashboard-container">
            <nav className="sidebar">
                <h2>Navigation</h2>
                <ul>
                    <li><Link to="/update-health">Update Health Data</Link></li>
                    <li><Link to="/check-symptoms">Check Symptoms</Link></li>
                    <li><Link to="/mental-health-resources">Mental Health Resources</Link></li>
                    <li><Link to="/nutrition-plan">Nutrition Plan</Link></li>
                    <li><Link to="/fitness-tracker">Fitness Tracker</Link></li>
                    <li><Link to="/book-appointment">Book Appointment</Link></li>
                    <li><Link to="/access-request">Request Access</Link></li>
                    <li><Link to="/reproductive-health-articles">Reproductive Health Articles</Link></li>
                    <li><Link to="/menstrual-tracker">Menstrual Tracker</Link></li>
                </ul>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </nav>
            <div className="main-content">
                <h2 className="dashboard-heading">Dashboard</h2>

                {userName && (
                    <div className="user-info">
                        <h3>Welcome {userName}</h3>

                        <p>Your User ID:</p>
                        <p>{userId}</p>
                    </div>
                )}

                {/* Health Data Section */}
                <div className="health-data">
                    <h3>Health Routine</h3>
                    {healthData ? (
                        <>
                            <p>Sleep: {healthData.sleep} Hours</p>
                            <p>Exercise: {healthData.exercise} Minutes</p>
                            <p>Water Intake: {healthData.waterIntake} Litres</p>
                            <p>Mood: {healthData.mood}</p>
                        </>
                    ) : (
                        <p>No health data available.</p>
                    )}
                </div>

                {/* Appointment Reminders Section */}
                <div className="appointment-reminders">
                    <h3>Appointment Reminders</h3>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    {reminders.length > 0 ? (
                        <ul>
                            {reminders.map((reminder, index) => (
                                <li key={index}>
                                    {reminder.date} at {reminder.time} - {reminder.providerName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No upcoming appointments.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
