// Import Event Services
const EventService = require('./../services/events')

// Import Calendar Services
const CalendarService = require('./../services/calendars')

// Import Invitation Services
const InvitationService = require('./../services/invitations')

//Import validations
const validateEventInput = require('./../validations/event')
const isEmpty = require('../utils/isEmpty')
const Invitation = require('../models/Invitation')

//Create event
createEventForAnyUser = exports.createEventForAnyUser = async function(newEvent,userId){
    try{
        let errors={};
        if(!newEvent.dates || !newEvent.dates.length){
            let dates = [];

            // recurringIn tells us if the event is recurring or not, for one time event, variable = 0 otherwise it is equal to the number of days
            if(newEvent.endTime<= newEvent.startTime){
                errors.time = "End Time cannot be less than or equal to start Time of the meeting";
                return ({status:400, message:errors})
            }
            var eventDate = {
                startTime: new Date(newEvent.startTime),
                endTime: new Date(newEvent.endTime),
            }
            if(!newEvent.dates){
                if(parseInt(newEvent.recurringIn,10)===0){
                    dates.push({
                        startTime:eventDate.startTime.toJSON(),
                        endTime:eventDate.endTime.toJSON()
                    })
                }
                else{
                    
                    // var eventDate = new Date(newEvent.startTime);
                    
                    for(let i=1;i<=365/parseInt(newEvent.recurringIn,10);i++){
                            dates.push({
                                startTime:eventDate.startTime.toJSON(),
                                endTime:eventDate.endTime.toJSON()
                            });
                            eventDate.startTime.setDate(eventDate.startTime.getDate()+parseInt(newEvent.recurringIn,10));
                            eventDate.endTime.setDate(eventDate.endTime.getDate()+parseInt(newEvent.recurringIn,10));
                    }
                }
                newEvent.dates = dates;
            }
        }

        

        const calendar = await CalendarService.findOneByUserId(userId);
        if(calendar) {
            newEvent.calendar = calendar._id;

            // Checking if any event exists in any of these recurring or one date
            const timeOverlap = await EventService.findDates(newEvent);

            if(timeOverlap){
                const date = timeOverlap.dates[0].startTime.getDate();
                const month = timeOverlap.dates[0].startTime.getMonth()+1   ;
                const year = timeOverlap.dates[0].startTime.getFullYear();
                const edate = timeOverlap.dates[0].endTime.getDate();
                const emonth = timeOverlap.dates[0].endTime.getMonth()+1   ;
                const eyear = timeOverlap.dates[0].endTime.getFullYear();
                const fromHours = timeOverlap.dates[0].startTime.getHours();
                const fromMinutes = timeOverlap.dates[0].startTime.getMinutes();
                const toHours = timeOverlap.dates[0].endTime.getHours();
                const toMinutes = timeOverlap.dates[0].endTime.getMinutes();
                errors.time = `Time Slot is not free as you have a meeting/appointment on ${date}/${month}/${year} ${fromHours}:${fromMinutes} Hours to ${edate}/${emonth}/${eyear} ${toHours}:${toMinutes} Hours, please choose a different time interval after consulting the calendar or free up the slot first`
                return ({status:403, message:errors})
            }

            const createdEvent = await EventService.create(newEvent);
            const EventSynced = await CalendarService.syncEvent(createdEvent._id,calendar._id);
            return ({status:200, message:createdEvent})
        }
        errors.calendar = "Calendar does not exists, please create a calendar first";

        return ({status:404, message:errors})


    } catch(errors){
        // console.log(errors)
        return ({status:400, message:errors})
    }
}

exports.create = async function(req,res, next) {
    const newEvent = {
        name:req.body.name,
        description:req.body.description,
        startTime:req.body.startTime,
        endTime:req.body.endTime,
        recurringIn:req.body.recurringIn.toString()
    }

    console.log(newEvent)
    const { errors, isValid } = validateEventInput({...newEvent,slots:req.body.slots})
    if(!isValid) {
        return res.status(400).json(errors);
    }

    try {
        const response = await createEventForAnyUser(newEvent,req.user.id);
        return res.status(response.status).json(response.message)
    } catch (errors) {
        return res.status(400).json(errors);
    }
}
exports.getEventsByDate = async function(req,res,next) {
    try{
        // If you want to get someone else's calendar's events by day pass a slug variable with the given slug
        const slug = req.query.slug;
        const date =req.query.date;
        const errors={}
        if(isEmpty(date)){
            errors.date = "Date is required";
            return res.status(400).json(errors);
        }
        let startTime = new Date(date);
        let endTime = new Date(date)
        endTime.setDate(endTime.getDate()+1);
        // console.log(startTime);
        // console.log(endTime);
        let calendar;
        if(slug){
            calendar = await CalendarService.findOne(slug)
        } else{
            calendar = await CalendarService.findOneByUserId(req.user.id);
        }
        if(calendar) {
            const events = await EventService.getEventsByDateOrMonth(calendar._id,startTime,endTime);
            let EventArray=[];
            events.forEach((event)=>{
                const eventItem={
                    id:event._id,
                    name:event.name,
                    description:event.description,
                    startTime:new Date(event.dates[0].startTime).toLocaleString(),
                    endTime:new Date(event.dates[0].endTime).toLocaleString()
                }

                /* 
                For Front End Reference
                If you want to convert startTime back to UTC
                var temp = new Date(eventItem.startTime)

                after that you can get Hours, Minutes etc in Local format using the respective functions
                var temp = new Date(eventItem.startTime)
                console.log(temp.getHours())
                */
               EventArray.push(eventItem)

            })
            // console.log(EventArray)
            return res.status(200).json(EventArray);
        }
        if(slug){
            errors.calendar = `Calendar with the slug ${slug} does not exists`;
        }
        else{
            errors.calendar = "Calendar does not exists, please create a calendar first"
        }

        res.status(404).json(errors)

    } catch(errors) {
        return res.status(400).json(errors);
    }
}

exports.getEventsByMonth = async function(req,res,next) {
    try{
        const date =req.query.date;
        // If you want to get someone else's calendar's events by month pass a slug variable with the given slug
        const slug = req.query.slug;
        const errors={}
        if(isEmpty(date)){
            errors.date = "Date is required";
            return res.status(400).json(errors);
        }
        let startTime = new Date(date);
        startTime.setDate(1);
        let endTime = new Date(date);
        endTime.setDate(1);
        endTime.setMonth(endTime.getMonth()+1);
        let calendar;
        if(slug){
            calendar = await CalendarService.findOne(slug)
        } else{
            calendar = await CalendarService.findOneByUserId(req.user.id);
        }
        if(calendar) {
            const events = await EventService.getEventsByDateOrMonth(calendar._id,startTime,endTime);
            let EventArray=[];
            events.forEach((event)=>{
                const eventItem={
                    id:event._id,
                    name:event.name,
                    description:event.description,
                    startTime:new Date(event.dates[0].startTime).toLocaleString(),
                    endTime:new Date(event.dates[0].endTime).toLocaleString()
                }

                /* 
                For Front End Reference
                If you want to convert startTime back to UTC
                var temp = new Date(eventItem.startTime)

                after that you can get Hours, Minutes etc in Local format using the respective functions
                var temp = new Date(eventItem.startTime)
                console.log(temp.getHours())
                */
               EventArray.push(eventItem)

            })
            // console.log(EventArray)
            return res.status(200).json(EventArray);
        }
        if(slug){
            errors.calendar = `Calendar with the slug ${slug} does not exists`;
        }
        else{
            errors.calendar = "Calendar does not exists, please create a calendar first"
        }

        res.status(404).json(errors)

    } catch(errors) {
        return res.status(400).json(errors);
    }
}

exports.updateEventById = async function(req,res,next) {
    const errors={}
    try{
        if(!req.params.id){
            return res.status(400).json({
                errors:{
                    id:"Event id is required"
                }
            })
        }
        if(req.body.newEndTime<= req.body.newStartTime){
            errors.time = "End Time cannot be less than or equal to start Time of the meeting";
            return res.status(400).json(errors)
        }
        const dates=
        [
            {
                startTime:req.body.newStartTime,
                endTime:req.body.newEndTime
            }
        ]
        const changedEvent={
            name:req.body.name,
            description:req.body.description,
            // oldDates:oldDates,
            dateId:req.body.dateId,
            dates:dates
        }
        for(let prop in changedEvent) if(!changedEvent[prop]) delete changedEvent[prop];

        const calendar = await CalendarService.findOneByUserId(req.user.id);
        changedEvent.calendar = calendar._id;

        // Check if the event is part of an invitation
        // If it is, then only the user can edit it, not anyone else
        const eventInvitation = await EventService.getEventById(req.params.id)
        if(!eventInvitation.invitation){
            // Event is not part of an invitation,simply delete it 

            if(changedEvent.datesId){
                const timeOverlap = await EventService.findDates(changedEvent);
    
                if(timeOverlap){
                    return res.status(400).json({message:"The slot is not free, please choose a different slot or free up the current one"})
                }
            }
            
            
            const updatedEvent = await EventService.updateEventById(changedEvent,req.params.id)
            if(updatedEvent)
                return res.status(200).json(updatedEvent)
            return res.status(400).json({message:"Event not found with your given details"})
        }
        else{
            // Event is part of an invitation, check if the user trying to update is the owner
            const isOwner = await InvitationService.checkIsOwner(req.user.id,eventInvitation.invitation)
            if(isOwner){
                // User is the owner, complex update mechanism 
                if(!changedEvent.dateId){
                // If the user just want to update the event's name and description
                // Just update this for all the users in the invitation list
                const updatedEventForYou = await EventService.updateEventById(changedEvent,req.params.id)
                if(updatedEventForYou){
                    const updatedEventForAll = await EventService.updateMultipleEvents(changedEvent,eventInvitation.invitation)
                    if(updatedEventForAll.nModified)
                        return res.status(200).json({message:"Event updated for everyone",event:updatedEventForYou,countUpdate:updatedEventForAll.nModified+1})
                    return res.status(200).json({message:"Event updated just for you",event:updatedEventForYou})
                }
                return res.status(400).json({message:"Event not found with your given details"})

                }
                else{
                    // If the user wants to change dates too

                    // Change your event first, delete events in everyone's calendar and then modify the invitation i.e. change actedUpon.action to notActed for everyone
                    if(changedEvent.dateId){
                        const timeOverlap = await EventService.findDates(changedEvent);
            
                        if(timeOverlap){
                            return res.status(403).json({message:"The slot is not free, please choose a different slot or free up the current one"})
                        }
                    }
                    
                    
                    const updatedEvent = await EventService.updateEventById(changedEvent,req.params.id)
                    console.log(updatedEvent)
                    if(updatedEvent){
                        // Event updated for you, now delete Multiple Events
                        const deleteMultipleEvents = await EventService.deleteMultipleEventsUpdate(eventInvitation.invitation,changedEvent.calendar)                        
                        // This will delete Events(if any exists)

                        // Update the invitation now
                        const updatedInvitation = await InvitationService.resetInvitationById(eventInvitation.invitation)
                        return res.status(200).json({message: "Event updated for you and changed invitations resent",event:updatedEvent,eventsDeleted:deleteMultipleEvents.deletedCount})
                    }
                    return res.status(403).json({message:"Event not found with your given details"})
                }

            } else{
                // User is not the owner, they cannot update the event, they can delete it in their calendar if they want
                return res.status(401).json({message:"UNAUTHORIZED!!! This event is part of an invitation and you're not the owner of the invitation, you cannot update the event. If you don't wish to attend, kindly delete the event from your calendar"})
            }
        }

        
    } catch (errors){
        console.log(errors)
        return res.status(400).json(errors)
    }
}

// To delete a recurring Event completely or just one date
exports.deleteEventById = async function(req,res,next) {
    try{
        if(!req.params.id){
            return res.status(400).json({
                errors:{
                    id:"Event id is required"
                }
            })
        }
        let recurring = {}
        console.log("Req.body is starting")
        console.log(req.body)
        console.log("body->recurring is ",req.body.deleteOneInRecurring)

        // Delete one in recurring
        // Send deleteOneInRecurring boolean in the delete request
        if(req.body.deleteOneInRecurring){
            recurring.boolean = true;
            recurring.dateId = req.body.dateId; 
        }
        else{
            recurring.boolean = false;
        }
        console.log("recurring in details",recurring)
        

        // Delete the whole event 
        // This is for deleting the complete event, irrespective of whether its a recurring event or not
        

        const deletedEvent = await EventService.deleteEventById(req.params.id,recurring);
        // console.log("Event deleted for you")
        // console.log(deletedEvent)
        if(deletedEvent){
            // Check if the event is a part of an invitation first
            if(deletedEvent.invitation){
                // Now check if he/she is the owner of this event, if yes delete this event for every user otherwise do nothing

                const isOwner = await InvitationService.checkIsOwner(req.user.id,deletedEvent.invitation);
                // console.log("isOwner")
                // console.log(isOwner)
                if(isOwner){
                    const deleteForEveryone = await EventService.deleteEventForAll(req.params.id,recurring,deletedEvent.invitation)
                    // console.log("Event deleted for everyone")
                    // console.log(deleteForEveryone)
                    if(deleteForEveryone.deletedCount){
                        if(recurring.boolean){
                            // Update invitation
                            const newEvent = await EventService.getEventById(deletedEvent._id)
                            const invitationDelete = await InvitationService.updateInvitationById(newEvent._id,deletedEvent.invitation)

                        }
                        else{
                            // Delete complete invitation
                            const invitationDelete = await InvitationService.deleteInvitationById(deletedEvent.invitation)
                            
                        }

                        return res.status(200).json({message:'Event Deleted for everyone along with invitation',deletedCount:deleteForEveryone.deletedCount, event:deletedEvent})
                    }
                    return res.status(200).json({message:'Event Deleted for you along with invitation', event:deletedEvent})

                    
                }
                else{
                    if(!recurring.boolean){
                        const syncDeletedInvitation = await InvitationService.setStatusDeleted(req.user.id,deletedEvent.invitation)
                        // console.log("sync delete")
                        // console.log(syncDeletedInvitation)
                        return res.status(200).json({message: 'Event Deleted', data: deletedEvent})
                    }
                    else{
                        return res.status(200).json({message: 'Event Deleted', data: deletedEvent})
                    }
                    
                }
            }
            return res.status(200).json({message: 'Event Deleted', data: deletedEvent})
        }
        return res.status(404).json({errors:{message:"Event not found"}})
    } catch(errors){
        return res.status(400).json(errors)
    }
}