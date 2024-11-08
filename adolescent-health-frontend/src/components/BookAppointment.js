import React, { useState } from 'react';
import axios from 'axios';
const BookAppointment = ({ token }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [providerName, setProviderName] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/appointments/book', {
                date,
                time,
                providerName,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message); // Success message
            setErrorMessage(''); // Clear any previous error messages
            // Reset form fields
            setDate('');
            setTime('');
            setProviderName('');
        } catch (error) {
            console.error('Failed to book appointment:', error);
            setErrorMessage(error.response?.data.error || 'Failed to book appointment'); // Display error message
            setMessage(''); // Clear success message
        }
    };

    return (
        <div>
            <h2>Book Appointment</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    placeholder="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="time"
                    placeholder="Time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Provider Name"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    required
                />
                <button type="submit">Book Appointment</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>} {/* Success message */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
        </div>
    );
};

export default BookAppointment;