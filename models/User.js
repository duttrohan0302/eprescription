const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  // Common Details
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  age: {
    type: Number,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
    // Values- admin, doctor, patient
  },
  specialization: {
    type: String
  }
});

module.exports = User = mongoose.model("users", UserSchema);
