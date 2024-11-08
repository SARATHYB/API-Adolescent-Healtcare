const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
    guardianId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    adolescentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Approved', 'Revoked'], default: 'Pending' }
});

const AccessRequest = mongoose.model('AccessRequest', accessRequestSchema);
module.exports = AccessRequest;
