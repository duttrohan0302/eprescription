//Import Model
const User = require('./../models/User')
const Prescription = require('./../models/Prescription')
const Feedback = require('./../models/Feedback')


exports.createPrescription = async function (newPrescription) {
    try {
        const prescription = await Prescription.create(newPrescription)

        const newPres = await Prescription.findById(prescription._id).populate('patient','email name age sex phone')
        console.log(newPres)
        return newPres
    } catch (e) {
        return e
    }
}

exports.getPrescriptionById = async function (prescriptionId) {
    try {
        const prescription = await Prescription.findById(prescriptionId).populate('patient doctor','name email phone sex age userRole')
        return prescription
    } catch (e) {
        return e
    }
}

exports.getAllPrescriptionByPatientId = async function (patientId) {
    try {
        const prescriptions = await Prescription.find({patient:patientId}).populate('patient doctor','name email phone sex age userRole')
        return prescriptions
    } catch (e) {
        return e
    }
}

exports.createFeedback = async function (newFeedback) {
    try {
        const feedback = await Feedback.create(newFeedback)
        return feedback
    } catch (e) {
        return e
    }
}
exports.getAllFeedbacksByDoctorId = async function (doctorId) {
    try {
        const feedbacks = await Feedback.find({doctor:doctorId})
        return feedbacks
    } catch (e) {
        return e
    }
}