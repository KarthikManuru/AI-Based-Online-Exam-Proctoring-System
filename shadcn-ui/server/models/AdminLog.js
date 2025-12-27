const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: String
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
