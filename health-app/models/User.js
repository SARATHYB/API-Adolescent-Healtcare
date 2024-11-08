const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['adolescent', 'guardian'], required: true },
    healthData: {
        sleep: Number,
        exercise: String,
        waterIntake: String,
        mood: String,
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
