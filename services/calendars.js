//Import Model
const Calendar = require('./../models/Calendar')

//Create calendar
exports.create = async function (newCalendar) {
    try {
        const calendar = await Calendar.create({user: newCalendar.user, slug: newCalendar.slug})

        return calendar;
    } catch (e) {
        return e
    }
}

exports.getAll = async function() {
    try{
        const calendars = await Calendar.find({}).populate('user',["name","email","phone"]).populate('events',["name","description","startTime","endTime"])
        return calendars
    } catch (e) {
        return e;
    }
}


// Delete a calendar
exports.delete = async function(id) {
    try{
        let response = await Calendar.findOneAndDelete({
            user:id
        })

        return response;
        
    } catch(errors) {
        return errors
    }
}

//Service to check if calendar slug already exists
exports.findOne = async function(slug) {

    let calendar = await Calendar.findOne({slug: slug})

    return calendar;
}

//Service to check if user's calendar already exists
exports.findOneByUserId = async function(id) {

    try{
        let calendar = await Calendar.findOne({user: id})
        return calendar;

    } catch (errors){
        return errors
    }
 }

exports.syncEvent = async function(eventId,calendarId){
    try{
        const info = await Calendar.findByIdAndUpdate(calendarId,{$push:{"events":eventId}});
        return info;
    } catch (errors) {
        return errors;
    }
}

exports.getMyCalendar = async function(userId){
    try{
        // const calendar = await Calendar.findOne({user:userId}).populate('user',["name","email","phone"]).populate('events',["name","description","dates","invitation"]);
        const calendar = await Calendar.findOne({user:userId})
        .populate({
            path : 'events',
            populate : {
              path : 'invitation',
              select:'fromUser actedUpon',
              populate:{
                  path: 'actedUpon.user fromUser',
                  select:'name email'
              },
            }
          })
            return calendar;

    } catch (errors) {
        return errors;
    }
}

exports.getCalendarBySlug = async function(slug){
    try{
        
        // const calendar = await Calendar.findOne({slug:slug}).populate('user',["name","email","phone"]).populate('events',["name","description","dates"]);
        const calendar = await Calendar.findOne({slug:slug}).populate('user',["name","email","phone"])
        .populate({
            path : 'events',
            populate : {
              path : 'invitation',
              select:'fromUser actedUpon',
              populate:{
                  path: 'actedUpon.user fromUser',
                  select:'name email'
              },
            }
          })
        return calendar;

    } catch (errors) {
        return errors;
    }
}

exports.setFreeSlots = async function(id,slots){
    try{
        const info = await Calendar.findByIdAndUpdate(id,{slots:slots},{new:true,omitUndefined:true});
        return info;
    }catch(errors){
        console.log(errors)
        return errors;
    }
}