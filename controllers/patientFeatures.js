// Import Services
const Feedback = require('../models/Feedback')
const Prescription = require('../models/Prescription')
const patientService = require('./../services/patientFeatures')
const { mailHost, mailAuthUser, mailAuthPass, frontendURL } = require('../config')
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: mailHost,
    port: 2525,
    auth: {
       user: mailAuthUser,
       pass: mailAuthPass
    }
});

exports.createPrescription = async function(req,res,next) {
    
    // console.log("here")
    const newPrescription = {
        patient: req.body.patient,
        doctor: req.user.id,
        // doctor: req.body.doctor,
        diagnosis: req.body.diagnosis,
        generalRemarks: req.body.generalRemarks,
        nextAppointment: req.body.nextAppointment,
        medicines: req.body.medicines,
    }
    const currentDate= new Date()
    try{

        const prescription = await patientService.createPrescription(newPrescription)
        // console.log(prescription)
        const message = {
            from: 'support@climbax.in', // Sender address
            to: prescription.patient.email,         // List of recipients
            subject: 'New Prescription', // Subject line
            html: 
                    `
                    <div className="container" style="border:3px blue solid;margin-top:30px">
                        <center>
                            <div>
                                <h3 style="color:#003399;text-align:center">Jeevan Jyoti Hospital</h3>
                                <h4>${req.user.name} </h4>
                                <h4><small>${req.user.specialization}</small></h4>
                            </div>
                        </center>
                        <hr>
                        <div className="container-fluid">
                            <div className="col-md-5">
                                <b>Dated: </b>
                                ${currentDate.getDate()}-${currentDate.getMonth()}-${currentDate.getFullYear()}
                            </div>
                            <div className="col-md-7">
                                <b>Patient Name:</b> ${prescription.patient.name}
                            </div>
                            <div className="col-md-2">
                                <b>Age: </b> ${prescription.patient.age}
                            </div>
                            <div className="col-md-3">
                                <b>Sex: </b> ${prescription.patient.sex}
                            </div>
                            <div className="col-md-7">
                                <b>Phone: </b> ${prescription.patient.phone}
                            </div>
                            <div className="col-md-5">
                                <b>Email:</b> ${prescription.patient.email}
                            </div>
                            <hr>

                        </div>
                        <div className="prescription-form container-fluid">
                            <div className="form-group">
                                <label htmlFor="comment"><b>Diagnosis:</b></label>
                                ${newPrescription.diagnosis}
                            </div>
                            <br>
                            <b>Medicines</b>
                                <table> 
                                    <tr>
                                        <th>S. No.</th>
                                        <th>Name</th>
                                        <th>Number of Days</th>
                                        <th>Frequency</th>
                                    </tr>
                                ${
                                    newPrescription.medicines.map((medicine, index) =>

                                            (`<tr>
                                                <td><center>${index+1}.</center></td>
                                                <td><center>${medicine.name}</center></td>
                                                <td><center>${medicine.numberOfDays}</center></td>
                                                <td><center>${medicine.frequency.toUpperCase()}</center></td>
                                            </tr>`)
                                )
                                }
                                </table>
                            </div>
                            <div className="form-group">
                                <label htmlFor="comment"><b>General Remarks:</b></label>
                                ${newPrescription.generalRemarks}
                            </div>
                            <br >
                            <b>Next Appointment Date</b> &nbsp;
                                ${new Date(newPrescription.nextAppointment).getDate()}-${new Date(newPrescription.nextAppointment).getMonth()}-${new Date(newPrescription.nextAppointment).getFullYear()}
                        </div>
                    </div>
                    `
        };
        const info = await transport.sendMail(message)
        // Mail sending finished

        return res.status(200).json(prescription)

    }
    catch(errors){
        console.log(errors)
        return res.status(400).json(errors)
        
    }
}

exports.getPrescriptionById = async function(req,res,next) {
    try{
        if(!req.params.prescriptionId){
            return res.status(400).json({
                errors:{
                    prescriptionId:"Prescription id is required"
                }
            })
        }

        const prescription = await patientService.getPrescriptionById(req.params.prescriptionId)

        return res.status(200).json(prescription)

    }
    catch(errors){
        return res.status(400).json(errors)
    }
}

exports.getAllPrescriptionByPatientId = async function(req,res,next) {
    try{
        if(!req.params.patientId){
            return res.status(400).json({
                errors:{
                    patientId:"Patient ID is required"
                }
            })
        }

        const prescriptions = await patientService.getAllPrescriptionByPatientId(req.params.patientId)

        return res.status(200).json(prescriptions)

    }
    catch(errors){
        return res.status(400).json(errors)
    }
}

exports.createFeedback = async function(req,res,next) {
    
    
    const newFeedback = {
        q1:req.body.q1,
        q2:req.body.q2,
        q3:req.body.q3,
        q4:req.body.q4,
        q5:req.body.q5,
        comments: req.body.comments,
        doctor: req.body.doctor
    }

    try{

        const feedback = await patientService.createFeedback(newFeedback)

        return res.status(200).json(feedback)

    }
    catch(errors){
        console.log(errors)
        return res.status(400).json(errors)
    }
}

exports.getAllFeedbacksByDoctorId = async function(req,res,next) {
    try{
        if(!req.params.doctorId){
            return res.status(400).json({
                errors:{
                    doctorId:"Doctor ID is required"
                }
            })
        }

        const feedbacks = await patientService.getAllFeedbacksByDoctorId(req.params.doctorId)

        return res.status(200).json(feedbacks)

    }
    catch(errors){
        return res.status(400).json(errors)
    }
}

