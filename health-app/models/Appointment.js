const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    providerName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Appointment = mongoose.model('Appointments', appointmentSchema);
module.exports = Appointment;



