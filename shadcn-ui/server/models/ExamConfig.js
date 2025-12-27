const mongoose = require('mongoose');

const examConfigSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    examOpen: { type: Boolean, default: false },
    proctoredMode: { type: Boolean, default: false },
    adminResetCode: { type: String, default: 'CSEADMIN2025' },
    allocationCounter: { type: Number, default: 0 }
});

module.exports = mongoose.model('ExamConfig', examConfigSchema);
