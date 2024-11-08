const mongoose = require('mongoose');

const nutritionPlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meals: [{
        name: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number
    }],
    dailyCalories: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NutritionPlan', nutritionPlanSchema);
