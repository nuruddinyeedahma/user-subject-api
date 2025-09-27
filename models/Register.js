// models/Register.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true }, 
    password: { type: String, required: true },              
    createdAt: { type: Date, default: Date.now },       
  },
  {
    collection: 'register',
  }
);

module.exports = mongoose.model('Register', userSchema);
