import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReproductiveHealthArticles = ({ token }) => {
    const [articles, setArticles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:3001/reproductive-health/articles', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArticles(response.data.articles); // Set articles from response
                setErrorMessage(''); // Clear any previous error messages
            } catch (error) {
                console.error('Failed to fetch articles:', error);
                setErrorMessage(error.response?.data.error || 'Failed to fetch articles'); // Display error message
            }
        };

        fetchArticles();
    }, [token]);

    return (
        <div>
            <h2>Reproductive Health Articles</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
            {articles.length > 0 ? (
                <ul>
                    {articles.map((article, index) => (
                        <li key={index}>
                            <a href={article.link} target="_blank" rel="noopener noreferrer">
                                {article.title}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No articles available.</p>
            )}
        </div>
    );
};

export default ReproductiveHealthArticles;