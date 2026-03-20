const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    default: "Guest Patient"
  },
  problemName: {
    type: String,
    required: true
  },
  medication: {
    type: String,
    required: true
  },
  carePlan: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Pending'],
    default: 'Active',
    index: true
  },
  accuracy: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
