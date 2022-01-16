//Import Required Libraries
const express = require('express')
const router = express.Router()

//Import controller
const UserController = require('../controllers/users')

//Import and require Passport
const passport = require("passport");
require("./../middlewares/passport")(passport);

//Login route
router.post('/login',UserController.login);

//Create User Route
// Frontend will send the userRole
router.post('/register', UserController.register);

//Get all users in database belonging to a particular userRole
// i.e. get all patients or get all doctors
router.get('/users/role/:userRole', UserController.getAll);

// Get user by id
router.get('/users/:id', passport.authenticate("jwt",{session:false}), UserController.getUserById)

// Update a user's details
router.patch('/users/:id',passport.authenticate("jwt",{session:false}), UserController.update);

// Delete a user
router.delete('/users',passport.authenticate("jwt",{session:false}), UserController.delete); 

router.get('/getMyDoctors', passport.authenticate("jwt",{session:false}), UserController.getMyDoctors)

// Reset Password/Forgot Password
router.post('/user/resetPassword', UserController.resetPassword);

// Set password using reset link
router.patch('/user/setPassword', UserController.setPassword);

// Change password
router.patch('/user/changePassword',passport.authenticate("jwt",{session:false}), UserController.changePassword);


//Export User Route
module.exports = router