import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AppointmentReminders.css';

const AppointmentReminders = ({ token }) => {
    const [reminders, setReminders] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/appointments/reminders', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReminders(response.data.reminders); // Set reminders from response
                setErrorMessage(''); // Clear any previous error messages
            } catch (error) {
                console.error('Failed to fetch reminders:', error);
                setErrorMessage(error.response?.data.error || 'Failed to fetch reminders'); // Display error message
            }
        };

        fetchReminders();
    }, [token]);

    return (
        <div className="main-content">

            <h3>Appointment Reminders</h3>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
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
    );
};

export default AppointmentReminders;