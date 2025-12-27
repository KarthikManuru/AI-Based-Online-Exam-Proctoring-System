const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  questionSet: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  responses: [{
    question: String,
    options: [String],
    chosenIndex: Number,
    correctIndex: Number,
    isCorrect: Boolean
  }],
  answers: [Number],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  cheated: { type: Boolean, default: false },
  cheatCount: { type: Number, default: 0 },
  status: { type: String, enum: ['in-progress', 'submitted'], default: 'in-progress' },
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  timeRemaining: Number
});

module.exports = mongoose.model('Attempt', attemptSchema);
