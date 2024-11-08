import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NutritionPlan = ({ token }) => {
    const [dailyCalories, setDailyCalories] = useState('');
    const [meals, setMeals] = useState('');
    const [nutritionPlan, setNutritionPlan] = useState(null);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlanExists, setIsPlanExists] = useState(false);

    // Fetch existing nutrition plan on component mount
    useEffect(() => {
        const fetchNutritionPlan = async () => {
            try {
                const response = await axios.get('http://localhost:3001/nutrition/plan', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.nutritionPlan) {
                    setNutritionPlan(response.data.nutritionPlan); // Set existing plan
                    setIsPlanExists(true); // Flag to show if plan already exists
                }
            } catch (error) {
                console.error('Failed to fetch nutrition plan:', error);
                setErrorMessage(error.response?.data.error || 'Failed to fetch nutrition plan');
            }
        };

        fetchNutritionPlan();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data to send to the backend
        const planData = {
            dailyCalories,
            meals: meals.split(',').map(meal => meal.trim()), // Convert input to array
        };

        try {
            let response;
            if (isPlanExists) {
                // If the plan already exists, update it
                response = await axios.put('http://localhost:3001/nutrition/plan', planData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // If the plan does not exist, create a new one
                response = await axios.post('http://localhost:3001/nutrition/plan', planData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            setNutritionPlan(response.data.nutritionPlan); // Update state with the plan
            setMessage(response.data.message); // Success message
            setErrorMessage(''); // Clear error message
            setIsPlanExists(true); // Mark that the plan exists

            // Reset form fields
            setDailyCalories('');
            setMeals('');
        } catch (error) {
            console.error('Failed to submit nutrition plan:', error);
            setErrorMessage(error.response?.data.error || 'Failed to submit nutrition plan');
            setMessage('');
        }
    };

    // Helper function to format the meal display
    const renderMealDetails = (meal) => (
        <div key={meal.name}>
            <h4>{meal.name}</h4>
            <p>Calories: {meal.calories}</p>
            <p>Protein: {meal.protein}g</p>
            <p>Carbs: {meal.carbs}g</p>
            <p>Fats: {meal.fats}g</p>
        </div>
    );

    return (
        <div>
            <h2>Nutritional Plan</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Daily Calories"
                    value={dailyCalories}
                    onChange={(e) => setDailyCalories(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Meals (comma-separated)"
                    value={meals}
                    onChange={(e) => setMeals(e.target.value)}
                    required
                />
                <button type="submit">{isPlanExists ? 'Update Nutrition Plan' : 'Create Nutrition Plan'}</button>
            </form>

            {message && <p style={{ color: 'green' }}>{message}</p>} {/* Success message */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}

            {/* Display existing nutrition plan if available */}
            {nutritionPlan && (
                <div>
                    <h3>Your Current Nutrition Plan</h3>
                    <p>Daily Calories: {nutritionPlan.dailyCalories}</p>
                    <div>
                        <h4>Meals:</h4>
                        {nutritionPlan.meals.map(meal => renderMealDetails(meal))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionPlan;
