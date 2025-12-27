const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const ExamConfig = require('../models/ExamConfig');
const AdminLog = require('../models/AdminLog');

// --- Exam Config ---
router.get('/config', async (req, res) => {
    try {
        let config = await ExamConfig.findOne({ id: 'main' });
        if (!config) {
            config = new ExamConfig({ id: 'main' });
            await config.save();
        }
        res.json(config);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/config', async (req, res) => {
    try {
        const config = await ExamConfig.findOneAndUpdate(
            { id: 'main' },
            { $set: req.body },
            { new: true, upsert: true }
        );
        res.json(config);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Attempts ---
router.post('/attempts', async (req, res) => {
    try {
        const attempt = new Attempt(req.body);
        await attempt.save();
        res.status(201).json(attempt);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/attempts', async (req, res) => {
    try {
        const attempts = await Attempt.find();
        res.json(attempts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/attempts/student/:studentId', async (req, res) => {
    try {
        const attempt = await Attempt.findOne({ studentId: req.params.studentId });
        // if (!attempt) return res.status(404).json({ message: 'Not found' });
        res.json(attempt); // Return null if not found, consistent with findOne
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/attempts/:id', async (req, res) => {
    try {
        const attempt = await Attempt.findOne({ id: req.params.id });
        if (!attempt) return res.status(404).json({ message: 'Not found' });
        res.json(attempt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/attempts/:id', async (req, res) => {
    try {
        const attempt = await Attempt.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        res.json(attempt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/attempts/:id', async (req, res) => {
    try {
        await Attempt.deleteOne({ id: req.params.id });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/attempts', async (req, res) => {
    try {
        await Attempt.deleteMany({});
        res.json({ message: 'All attempts cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Admin Logs ---
router.post('/logs', async (req, res) => {
    try {
        const log = new AdminLog(req.body);
        await log.save();
        res.status(201).json(log);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/logs', async (req, res) => {
    try {
        const logs = await AdminLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/logs', async (req, res) => {
    try {
        await AdminLog.deleteMany({});
        res.json({ message: 'All logs cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
