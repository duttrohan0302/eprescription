//Import Required Libraries
const express = require('express')
const router = express.Router()

//Import controller
const PatientFeatureController = require('../controllers/patientFeatures')

//Import and require Passport
const passport = require("passport");
require("./../middlewares/passport")(passport);

//Create prescription route
router.post('/prescription',passport.authenticate("jwt",{session:false}),PatientFeatureController.createPrescription);

//Get prescription by id route
router.get('/prescription/:prescriptionId',passport.authenticate("jwt",{session:false}),PatientFeatureController.getPrescriptionById);

//get all prescription for a patient route
router.get('/prescriptions/:patientId',passport.authenticate("jwt",{session:false}),PatientFeatureController.getAllPrescriptionByPatientId);

//Create feedback route
router.post('/feedback',passport.authenticate("jwt",{session:false}),PatientFeatureController.createFeedback);

//Get all feedbacks of a doctor route
router.get('/feedbacks/:doctorId',passport.authenticate("jwt",{session:false}),PatientFeatureController.getAllFeedbacksByDoctorId);

//Export User Route
module.exports = router


