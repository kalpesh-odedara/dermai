const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, default: 'Pending', index: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
