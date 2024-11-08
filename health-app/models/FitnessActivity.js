const mongoose = require('mongoose');

const fitnessActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activity: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    date: { type: Date, default: Date.now }
});

const FitnessActivity = mongoose.model('FitnessActivity', fitnessActivitySchema);
module.exports = FitnessActivity;
