const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
    user: {
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    slug: {
        type: String,
        required: true,
    },
    events: [{
        type:Schema.Types.ObjectId,
        ref:'events'
    }],
    slots:{
        monday: {
            startTime:{
                type: Date,
                default:new Date('2020-01-01T00:00:00')
            },
            endTime:{
                type: Date,
                default:new Date('2020-01-01T23:59:00')
            }
        },
        tuesday: {
            startTime:{
                type: Date,
                default:new Date('2020-01-01T00:00:00')
            },
            endTime:{
                type: Date,
                default:new Date('2020-01-01T23:59:00')
            }
        },
        wednesday: {
            startTime:{
                type: Date,
                default:new Date('2020-01-01T00:00:00')
            },
            endTime:{
                type: Date,
                default:new Date('2020-01-01T23:59:00')
            }
        },
        thursday: {
            startTime:{
                type: Date,
                default:new Date('2020-01-01T00:00:00')
            },
            endTime:{
                type: Date,
                default:new Date('2020-01-01T23:59:00')
            }
        },
        friday:{
            startTime:{
                type: Date,
                default:new Date('2020-01-01T00:00:00')
            },
            endTime:{
                type: Date,
                default:new Date('2020-01-01T23:59:00')
            }
        },
        saturday:{
            startTime:{
                type: Date,
                default:new Date('2020-01-01T00:00:00')
            },
            endTime:{
                type: Date,
                default:new Date('2020-01-01T23:59:00')
            }
        },
        sunday:{
            startTime:{
                type: Date,
                default:new Date('2020-01-01T00:00:00')
            },
            endTime:{
                type: Date,
                default:new Date('2020-01-01T23:59:00')
            }
        }
    }

});

module.exports = Calendar = mongoose.model("calendars", CalendarSchema);