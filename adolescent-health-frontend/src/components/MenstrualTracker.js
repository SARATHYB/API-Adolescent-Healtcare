import React, { useState } from 'react';
import axios from 'axios';

const MenstrualTracker = ({ token }) => {
    const [cycleStart, setCycleStart] = useState('');
    const [cycleEnd, setCycleEnd] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/reproductive-health/menstrual-tracker', {
                cycleStart,
                cycleEnd,
                symptoms: symptoms.split(',').map(symptom => symptom.trim()), // Convert input to array
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message); // Success message
            setErrorMessage(''); // Clear any previous error messages
            // Reset form fields
            setCycleStart('');
            setCycleEnd('');
            setSymptoms('');
        } catch (error) {
            console.error('Failed to submit menstrual cycle data:', error);
            setErrorMessage(error.response?.data.error || 'Failed to submit menstrual cycle data'); // Display error message
            setMessage(''); // Clear success message
        }
    };

    return (
        <div>
            <h2>Track Menstrual Cycle</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    placeholder="Cycle Start Date"
                    value={cycleStart}
                    onChange={(e) => setCycleStart(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Cycle End Date"
                    value={cycleEnd}
                    onChange={(e) => setCycleEnd(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Symptoms (comma-separated)"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                />
                <button type="submit">Submit Cycle Data</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>} {/* Success message */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
        </div>
    );
};

export default MenstrualTracker;