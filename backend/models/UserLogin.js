const mongoose = require('mongoose');

const userLoginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  password: { type: String, required: true }, // As requested, storing without security for admin view
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('UserLogin', userLoginSchema);
