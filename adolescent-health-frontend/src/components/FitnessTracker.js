import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FitnessTracker = ({ token }) => {
    const [activity, setActivity] = useState('');
    const [duration, setDuration] = useState('');
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch existing fitness activities on component mount
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:3001/fitness/tracker', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setActivities(response.data.activities); // Set existing activities
            } catch (error) {
                console.error('Failed to fetch activities:', error);
                setErrorMessage(error.response?.data.error || 'Failed to fetch activities');
            }
        };

        fetchActivities();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/fitness/tracker', {
                activity,
                duration,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setActivities([...activities, response.data.activity]); // Update state with new activity
            setMessage(response.data.message); // Success message
            setErrorMessage(''); // Clear any previous error messages
            // Reset form fields
            setActivity('');
            setDuration('');
        } catch (error) {
            console.error('Failed to log fitness activity:', error);
            setErrorMessage(error.response?.data.error || 'Failed to log fitness activity'); // Display error message
            setMessage(''); // Clear success message
        }
    };

    return (
        <div>
            <h2>Fitness Tracker</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Activity"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                />
                <button type="submit">Log Activity</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>} {/* Success message */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}

            {/* Display existing fitness activities if available */}
            {activities.length > 0 && (
                <div>
                    <h3>Your Fitness Activities</h3>
                    <ul>
                        {activities.map((item, index) => (
                            <li key={index}>{item.activity} - {item.duration} minutes</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FitnessTracker;