import React, { useState } from 'react';
import axios from 'axios';

const AccessRequest = ({ token }) => {
    const [adolescentId, setAdolescentId] = useState('');
    const [guardianId, setGuardianId] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/guardian/access-request', {
                adolescentId,
                guardianId,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message); // Success message
            setErrorMessage(''); // Clear any previous error messages
            // Reset form fields
            setAdolescentId('');
            setGuardianId('');
        } catch (error) {
            console.error('Failed to submit access request:', error);
            setErrorMessage(error.response?.data.error || 'Failed to submit access request'); // Display error message
            setMessage(''); // Clear success message
        }
    };

    return (
        <div>
            <h2>Request Access</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Adolescent ID"
                    value={adolescentId}
                    onChange={(e) => setAdolescentId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Guardian ID"
                    value={guardianId}
                    onChange={(e) => setGuardianId(e.target.value)}
                    required
                />
                <button type="submit">Submit Access Request</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>} {/* Success message */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
        </div>
    );
};

export default AccessRequest;