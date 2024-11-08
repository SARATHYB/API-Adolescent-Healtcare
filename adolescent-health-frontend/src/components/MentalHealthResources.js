import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MentalHealthResources = ({ token }) => {
    const [resources, setResources] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get('http://localhost:3001/mentalhealth/resources', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setResources(response.data.resources); // Set resources from response
                setErrorMessage(''); // Clear any previous error messages
            } catch (error) {
                console.error('Failed to fetch resources:', error);
                setErrorMessage(error.response?.data.error || 'Failed to fetch resources'); // Display error message
            }
        };

        fetchResources();
    }, [token]);

    return (
        <div>
            <h2>Mental Health Resources</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
            <ul>
                {resources.map((resource, index) => (
                    <li key={index}>
                        {resource.type === "tip" ? (
                            <span>{resource.content}</span>
                        ) : (
                            <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                {resource.title}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MentalHealthResources;