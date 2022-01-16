const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PrescriptionSchema = new Schema({
  // Common Details
  patient:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  doctor:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  diagnosis: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  generalRemarks: {
    type: String,
  },
  nextAppointment: {
    type: Date,
  },
  medicines: [
      {
          name: {
              type: String,
          },
          frequency: {
              type: String
          },
          numberOfDays: {
              type: Number
          }
      }
  ]
});

module.exports = Prescription = mongoose.model("prescriptions", PrescriptionSchema);
