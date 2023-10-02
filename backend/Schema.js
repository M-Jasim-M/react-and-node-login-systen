// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // Hashed password should be stored here
 image: String, // Store the image file path here
  verificationCode: String, // Add this field
  isVerified: { type: Boolean, default: false },
  resetToken: String, // Add this field for storing the reset token
  resetTokenExpires: Date,
});

module.exports = mongoose.model('User', userSchema);
