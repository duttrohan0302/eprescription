//Import Model
const Event = require('./../models/Event')

//Create event
exports.create = async function (newEvent) {
    try {
        const event = await Event.create({calendar: newEvent.calendar, name: newEvent.name, description: newEvent.description,dates:newEvent.dates})
        return event;

    } catch (e) {
        return e
    }
}

// Finds and returns the events occurring on a day or in a month
exports.getEventsByDateOrMonth = async function(calendar,givenStartTime,givenEndTime){
    try{
        const events = await Event.find({
            calendar:calendar,
            dates:{$elemMatch:{startTime:{$gte: givenStartTime,$lte: givenEndTime}}},
        },{name:1,description:1, 'dates.$':1}).sort([['dates',-1]])
        return events;
    } catch (e) {
        console.log(e)
        return e;
    }
}


// The following code loops through each object in the dates array and returns any date on which any event overlaps the new event
exports.findDates = async function(newEvent){
    const newDates=newEvent.dates;
        for(let newSingleDate in newDates){
            console.log(newDates[newSingleDate])
            const timeOverlap = await findTimeOverlap(newEvent,newDates[newSingleDate]);
            if(timeOverlap) return timeOverlap
        }

     // If control reaches here, the slot is free
     return null;

}

findTimeOverlap = async function (newEvent,newSingleDates) {
        // Takes care if the new Event lies exactly or in between any old event in the same calendar
        const timeOverlap = await Event.findOne({
            calendar:newEvent.calendar,
            dates:{$elemMatch:{startTime:{$gte :newSingleDates.startTime},endTime:{$lte: newSingleDates.endTime}}},
        },{ "dates.$": 1 })
        if(timeOverlap) return timeOverlap;

        // Takes care if any old event starts before the new event but ends in-between the new event
        const timeOverlap2 = await Event.findOne({
                calendar:newEvent.calendar,
                dates:{$elemMatch:{startTime:{$lte: newSingleDates.startTime},endTime:{$lte: newSingleDates.endTime},endTime: {$gt: newSingleDates.startTime}}},   
            },{ "dates.$": 1 })
        if(timeOverlap2) return timeOverlap2;

        // Takes care if any old event starts in-between the new event and ends after it
        const timeOverlap3 = await Event.findOne({
            calendar:newEvent.calendar,
            dates:{$elemMatch:{startTime:{$gte :newSingleDates.startTime},startTime: {$lt: newSingleDates.endTime},endTime:{$gte: newSingleDates.endTime}}}, 
        },{ "dates.$": 1 })
        if(timeOverlap3) return timeOverlap3;

        // Takes care if the new event lies in between any old event
        const timeOverlap4 = await Event.findOne({
            calendar:newEvent.calendar,
            dates:{$elemMatch:{startTime:{$lt :newSingleDates.startTime},endTime:{$gt: newSingleDates.endTime}}},   
        },{ "dates.$": 1 })
        if(timeOverlap4) return timeOverlap4;
      
            
}

exports.deleteEventById = async function(id,recurring) {
    console.log(recurring)
    try{
        if(recurring.boolean===false){
            const deletedEvent = await Event.findByIdAndDelete(id)
            return deletedEvent;
        }
        const deletedEvent = await Event.findOneAndUpdate({_id:id},
            {$pull:{dates:{_id:recurring.dateId}}},{new:true})
        return deletedEvent;
    } catch(errors){
        console.log(errors)
        return errors;
    }
}

exports.updateEventById = async function(changedEvent,id) {
    try{
        if(changedEvent.dateId){
        const updatedEvent = await Event.findOneAndUpdate(
            {_id:id,'dates._id':changedEvent.dateId},
                { name:changedEvent.name,description:changedEvent.description,
                "dates.$.startTime": changedEvent.dates[0].startTime,"dates.$.endTime":changedEvent.dates[0].endTime },
            {new:true,omitUndefined:true})

            return updatedEvent;
        }
        else{
            const updatedEvent = await Event.findOneAndUpdate(
                {_id:id},
                { $set: 
                    {name:changedEvent.name,description:changedEvent.description}
                },
                {new:true,omitUndefined:true})
        
            console.log(updatedEvent)
            return updatedEvent;
        }
    } catch(errors) {
        console.log(errors)
        return errors;
    }
}

exports.eventSyncInvitation = async function(eventId,invitationId){

    try{
        const updatedEvent = await Event.findOneAndUpdate(
            {_id:eventId},
            { $set: 
                {invitation:invitationId,}
            },
            {new:true})

        return updatedEvent;
    } catch(errors) {
        console.log(errors);
        return errors;
    }
}

exports.deleteEventForAll = async function(id,recurring,invitationId) {
    try{
        if(recurring.boolean===false){
            const deletedEvent = await Event.deleteMany({invitation:invitationId})
            console.log(deletedEvent)
            return deletedEvent;
        }
        const deletedEvent = await Event.updateMany({invitation:invitationId},
            {$pull:{dates:{_id:recurring.dateId}}},
            {name:1,description:1, 'dates.$':1,new:true})
            console.log(deletedEvent)

        return deletedEvent;
    } catch(errors){
        console.log(errors)
        return errors;
    }
}

exports.getEventById = async function(id){
    try{
        const event = await Event.findById(id);
        return event;
    } catch(errors){
        console.log(errors);
        return errors;
    }
}

exports.updateMultipleEvents = async function(updateEvent,invitationId){
    try{
        const changedEvent = await Event.updateMany({invitation:invitationId},
            { $set: 
                {name:updateEvent.name,description:updateEvent.description}
            },
            {new:true,omitUndefined:true})

        return changedEvent
    } catch(errors){
        console.log(errors);
        return errors;
    }
}

exports.deleteMultipleEventsUpdate = async function(invitationId,calendarId){
    try{
        const deletedEvent = await Event.deleteMany({invitation:invitationId,calendar:{$ne:calendarId}})
        return deletedEvent;
    }catch(errors){
        console.log(errors);
        return errors;
    }
}

exports.deleteEventsByInvitation = async function(invitationId,eventId){
    try{
        const deletedEvent = await Event.deleteMany({invitation:invitationId,_id:{$ne:eventId}})
        return deletedEvent;
    }catch(errors){
        console.log(errors);
        return errors;
    }
}