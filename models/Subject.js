// models/Subject.js

const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: { type: String, unique: true },
  subjectName: String,
  credit: Number,
});

const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);

module.exports = Subject;
