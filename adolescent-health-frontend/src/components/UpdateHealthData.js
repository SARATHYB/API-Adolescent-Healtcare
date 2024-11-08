import React, { useState } from 'react';
import axios from 'axios';

const UpdateHealthData = ({ token }) => {
    const [sleep, setSleep] = useState('');
    const [exercise, setExercise] = useState('');
    const [waterIntake, setWaterIntake] = useState('');
    const [mood, setMood] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/dashboard/update', {
                sleep,
                exercise,
                waterIntake,
                mood,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message); // Success message
            setErrorMessage(''); // Clear any previous error messages
        } catch (error) {
            console.error('Update failed:', error);
            setErrorMessage(error.response?.data.error || 'Update failed'); // Display error message
            setMessage(''); // Clear success message
        }
    };

    return (
        <div>
            <h2>Update Health Data</h2>
            <form onSubmit={handleSubmit}>
                {/* Input fields for health data */}
                <input type="text" placeholder="Sleep (hours)" value={sleep} onChange={(e) => setSleep(e.target.value)} required />
                <input type="text" placeholder="Exercise (minutes)" value={exercise} onChange={(e) => setExercise(e.target.value)} required />
                <input type="text" placeholder="Water Intake (liters)" value={waterIntake} onChange={(e) => setWaterIntake(e.target.value)} required />
                <input type="text" placeholder="Mood" value={mood} onChange={(e) => setMood(e.target.value)} required />
                <button type="submit">Update</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>} {/* Success message */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
        </div>
    );
};

export default UpdateHealthData;