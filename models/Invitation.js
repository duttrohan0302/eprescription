const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const InvitationSchema = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'events'
  },
  actedUpon:[
      {
          user:{
            type: Schema.Types.ObjectId,
            ref: 'users'
          },
        //   action can have accepted, rejected or notActed
          action:{
              type:String,
              required: true,
              default:"notActed"
          }
      }
  ]
});

module.exports = Event = mongoose.model("invitations", InvitationSchema);
