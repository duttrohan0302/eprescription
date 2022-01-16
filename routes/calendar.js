//Import Required Libraries
const express = require('express')
const router = express.Router()

//Import controller
const CalendarController = require('../controllers/calendars')

//Import and require Passport
const passport = require("passport");
require("../middlewares/passport")(passport);

//Create a calendar route
router.post('/calendar', passport.authenticate("jwt",{session:false}) ,CalendarController.create);

// Get all calendars
router.get('/calendars',CalendarController.getAll);

// Set free slots in calendar
router.patch('/calendar/slots',passport.authenticate("jwt",{session:false}) ,CalendarController.setFreeSlots)

// Get free slots in calendar
router.get('/calendar/slots',passport.authenticate("jwt",{session:false}) ,CalendarController.getFreeSlots)

// Get the logged in user's calendar
router.get('/calendar', passport.authenticate("jwt",{session:false}) ,CalendarController.getMyCalendar);

// Get a calendar by calendar slug
router.get('/calendar/:slug' ,CalendarController.getCalendarBySlug);

// Delete the calendar
router.delete('/calendar', passport.authenticate("jwt",{session:false}) ,CalendarController.delete);


//Export Calendar Route
module.exports = router