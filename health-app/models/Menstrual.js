const mongoose = require('mongoose');

const menstrualschema = new mongoose.Schema({
    cycleStart: { type: Date, required: true },
    cycleEnd: { type: Date, required: true },
    symptoms: { type: Array, required: true },

});

const Menstrual = mongoose.model('Menstrual', menstrualschema);
module.exports = Menstrual;



