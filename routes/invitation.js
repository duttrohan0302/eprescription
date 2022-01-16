//Import Required Libraries
const express = require('express')
const router = express.Router()

//Import controller
const InvitationController = require('../controllers/invitations')

//Import and require Passport
const passport = require("passport");
require("../middlewares/passport")(passport);

//Create a invitation route
router.post('/invitation/:eventId', passport.authenticate("jwt",{session:false}) ,InvitationController.create);

// Get the logged in user's invitations
router.get('/invitations', passport.authenticate("jwt",{session:false}) ,InvitationController.getMyInvitations);

// Accept invitation by invitation id
router.patch('/invitation/accept/:id', passport.authenticate("jwt",{session:false}) ,InvitationController.acceptInvitationById);

// Reject invitation by invitation id
router.patch('/invitation/reject/:id', passport.authenticate("jwt",{session:false}) ,InvitationController.rejectInvitationById);


// Suggest something in an invitation by invitation id
router.patch('/invitation/suggest/:id', passport.authenticate("jwt",{session:false}) ,InvitationController.suggestInInvitation);

// See all your sent invitations
router.get('/invitations/sent',passport.authenticate("jwt",{session:false}) ,InvitationController.getSentInvitations)
// // Delete an invitation
router.delete('/invitation/:id', passport.authenticate("jwt",{session:false}) ,InvitationController.deleteInvitationById);


// //Export Invitation Route
module.exports = router