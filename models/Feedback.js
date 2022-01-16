const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const FeedbackSchema = new Schema({
  doctor:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  q1: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  q2: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  q3: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  q4: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  q5: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: {
    type: String,
    required: false
  }
});

module.exports = Feedback = mongoose.model("feedbacks", FeedbackSchema);
