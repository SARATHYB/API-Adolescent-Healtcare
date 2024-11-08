import React, { useState } from 'react';
import axios from 'axios';

const CheckSymptoms = ({ token }) => {
    const [symptoms, setSymptoms] = useState('');
    const [advice, setAdvice] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/symptoms/check',
                { symptoms: symptoms.split(',').map(symptom => symptom.trim()) }, // Convert input to an array
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAdvice(response.data.advice); // Set advice from response
            setErrorMessage(''); // Clear any previous error messages
        } catch (error) {
            console.error('Symptom check failed:', error);
            setErrorMessage(error.response?.data.error || 'Symptom check failed'); // Display error message
            setAdvice(''); // Clear advice message
        }
    };

    return (
        <div>
            <h2>Check Symptoms</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter symptoms (comma-separated)"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    required
                />
                <button type="submit">Check Symptoms</button>
            </form>
            {advice && <p style={{ color: 'green' }}>{advice}</p>} {/* Display advice */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
        </div>
    );
};

export default CheckSymptoms;