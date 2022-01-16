//Import validations
const validateCalendarInput = require('./../validations/calendar')
const validateSlotInput = require('./../validations/slots')

// Import Calendar Services
const CalendarService = require('./../services/calendars');

//Create calendar
exports.create = async function(req,res, next) {
    const { errors, isValid } = validateCalendarInput(req.body)
    if(!isValid) {
        return res.status(400).json(errors);
    }
    const newCalendar = {
        user: req.user.id,
        slug: req.body.slug,
    }
    try {
        const userCalendar = await CalendarService.findOneByUserId(newCalendar.user)
        if(!userCalendar){
            const calendar = await CalendarService.findOne(newCalendar.slug)
            if(!calendar) {
                const createdCalendar = await CalendarService.create(newCalendar)
                return res.status(200).json(createdCalendar)
            }
            errors.slug = "Calendar slug already exists, please choose a different slug";
            res.status(409).json(errors)

        }
        errors.calendar = "Calendar already exists, each user can have only one calendar"
        res.status(409).json(errors)
    } catch (errors) {
        return res.status(400).json(errors);
    }
}

// Get all calendars
exports.getAll = async function(req,res,next){
    try{
        const calendars = await CalendarService.getAll();

        return res.status(200).json(calendars);

    } catch (errors) {
        return res.status(400).json(errors)
    }
}

// Get logged in user calendar
exports.getMyCalendar = async function(req,res,next){
    try{
        const calendar = await CalendarService.getMyCalendar(req.user.id);
        return res.status(200).json(calendar);

    } catch (errors) {
        return res.status(400).json(errors)
    }
}

// Get calendar by slug
exports.getCalendarBySlug = async function(req,res,next) {
    try{
        const calendar = await CalendarService.getCalendarBySlug(req.params.slug);

        if(calendar)
            return res.status(200).json(calendar);  
        return res.status(400).json({slug: `Calendar with the slug (${req.params.slug}) does not exist`})
    } catch (errors) {
        return res.status(400).json(errors)
    }
}



exports.delete = async function(req,res, next) {
    try {
        const calendar = await CalendarService.delete(req.user.id)

        return res.status(200).json({message: 'Calendar Deleted', data: calendar})
 
    } catch (errors) {
        return res.status(400).json(errors);
    }
}

exports.setFreeSlots = async function(req,res, next) {
    try {

        const slots = req.body.slots;
        const calendar = await CalendarService.findOneByUserId(req.user.id);
        const { errors, isValid } = validateSlotInput(slots)
        if(!isValid) {
            return res.status(400).json(errors);
        }
        const response = await CalendarService.setFreeSlots(calendar.id,slots);
        return res.status(200).json(response.slots)
 
    } catch (errors) {
        console.log(errors)
        return res.status(400).json(errors);
    }
}

exports.getFreeSlots = async function(req,res, next) {
    try {
        const calendar = await CalendarService.findOneByUserId(req.user.id);
        return res.status(200).json(calendar.slots)
 
    } catch (errors) {
        return res.status(400).json(errors);
    }
}