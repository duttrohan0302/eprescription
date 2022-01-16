const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EventSchema = new Schema({
  calendar: {
    type: Schema.Types.ObjectId,
    ref: 'calendars'
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dates:[{
    startTime:Date,
    endTime:Date
  }],
  invitation:{
    type: Schema.Types.ObjectId,
    ref: 'invitations'
  }
});

module.exports = Event = mongoose.model("events", EventSchema);
