//Import Required Libraries
const express = require('express')
const router = express.Router()

//Import controller
const EventController = require('../controllers/events')

//Import and require Passport
const passport = require("passport");
require("./../middlewares/passport")(passport);

//Create Event route
router.post('/events',passport.authenticate("jwt",{session:false}),EventController.create);

// Get all events in a day in the calendar
router.get('/eventsByDate',passport.authenticate("jwt",{session:false}), EventController.getEventsByDate)

// Get all events in a this month in the calendar
// Enter start date of the required month
router.get('/eventsByMonth',passport.authenticate("jwt",{session:false}), EventController.getEventsByMonth)

// Update an event's details
router.patch('/events/:id',passport.authenticate("jwt",{session:false}), EventController.updateEventById);

// Delete an event
router.delete('/events/:id',passport.authenticate("jwt",{session:false}), EventController.deleteEventById); 

//Export User Route
module.exports = router