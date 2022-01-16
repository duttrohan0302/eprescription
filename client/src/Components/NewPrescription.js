import React, { useState, useEffect } from 'react';
import { getAllPatients, savePrescription } from "../Actions/authActions";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Button } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import CancelIcon from '@material-ui/icons/Cancel';
import {Link} from 'react-router-dom'

const NewPrescription = ({ getAllPatients, patients, user, savePrescription }) => {

    const [selectedOption, setSelectedOption] = useState(0)
    const [patient, setPatient] = useState(null)

    useEffect(() => {
        getAllPatients();

    }, [getAllPatients])

    const [formData, setFormData] = useState({
        diagnosis: '',
        generalRemarks: '',
        nextAppointment: new Date(),
        medicines: [
            {
                name: '',
                frequency: 0,
                numberOfDays: ''
            }
        ]
    })

    const addNewMedicine = () => {
        setFormData({
            ...formData, medicines:
                [...formData.medicines,
                {
                    name: '',
                    frequency: 0,
                    numberOfDays: ''
                }
                ]
        })
    }

    const onChangeForm = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const onChangeDate = date => {
        setFormData({ ...formData, nextAppointment: date })
    }

    const onChangeOption = (e) => {
        setSelectedOption(e.target.value)
    }

    const showPrescriptionForm = (id) => {
        setPatient(patients.filter(pat => pat._id === id)[0])
    }


    const onSubmit = () => {
        formData.patient = patient._id
        console.log(formData)
        savePrescription(formData)
        setSelectedOption(0)
        setPatient(null)
        setFormData({
            diagnosis: '',
            generalRemarks: '',
            nextAppointment: new Date(),
            medicines: [
                {
                    name: '',
                    frequency: 0,
                    numberOfDays: ''
                }
            ]
        })
    }
    return (
        <div>
            <select onChange={onChangeOption} style={{ padding: 5, margin: 5, width: 500 }}>
                <option value={0} style={{ padding: 5, margin: 5 }}>Select Patient</option>
                {
                    patients &&
                    patients.map(patient => <option value={patient._id}>{patient.name}</option>)
                }
            </select>
            <Button color="success" disabled={!selectedOption} style={{ marginLeft: 50, height: 35, width: 100 }} onClick={() => showPrescriptionForm(selectedOption)}>Go</Button>
            {
                patient ?
                    // <span className="float float-right"><Button color="info">View Old Prescriptions</Button></span>
                    <span className="float float-right"><Link to={{pathname:'/prescriptions',patientId:patient._id}}>View Old Prescriptions</Link></span>
                    :
                    null
            }
            {
                patient ?
                    <div className="container" style={{ border: '3px blue solid', marginTop: '30px' }}>
                        <div className="text-center">
                            <h3 style={{ color: '#003399', textAlign: 'center' }}>Jeevan Jyoti Hospital</h3>
                            <h4>{user.name} </h4>
                            <h4><small>{user.specialization}</small></h4>
                        </div>
                        <hr style={{ color: 'blue', height: '2px' }} />
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-7">

                                </div>
                                <div className="col-md-5">
                                    Date: <Flatpickr
                                        value={new Date()}
                                        options={{
                                            enableTime: false,
                                            altFormat: 'M j, Y',
                                            altInput: true,
                                            altInputClass: 'd-inline-block w-80 border border-secondary bg-light p-0 pl-2',
                                            dateFormat: "d-m-Y",
                                        }}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-7">
                                    Patient Name: {patient.name}
                                </div>
                                <div className="col-md-2">
                                    Age: {patient.age}
                                </div>
                                <div className="col-md-3">
                                    Sex: {patient.sex}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-7">
                                    Phone: {patient.phone}
                                </div>
                                <div className="col-md-5">
                                    Email: {patient.email}
                                </div>
                            </div>
                            <hr style={{ color: 'blue', height: '2px' }} />

                        </div>
                        <div className="prescription-form container-fluid">
                            <div className="form-group">
                                <label htmlFor="comment">Diagnosis</label>
                                <textarea
                                    rows="2"
                                    className="form-control"
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={onChangeForm}
                                ></textarea>
                            </div>
                            <br />
                            Medicines
                            <div className="container-fluid">
                                {
                                    formData.medicines.map((medicine, index) => {

                                        const onMedicineChange = (e) => {
                                            let newMeds = formData.medicines.map(a => a);
                                            newMeds[index][e.target.name] = e.target.value
                                            setFormData({
                                                ...formData,
                                                medicines: newMeds
                                            })
                                        }
                                        const removeMedicine = (med) => {
                                            setFormData({ ...formData, medicines: formData.medicines.filter(medicine => medicine.name !== med.name) })
                                        }
                                        return (
                                            <div className="row">
                                                <div className="col">
                                                    <input
                                                        style={{ paddingLeft: '5px' }}
                                                        placeholder="Medicine Name"
                                                        value={medicine.name}
                                                        name="name"
                                                        onChange={onMedicineChange}
                                                    />
                                                </div>

                                                <div className="col">
                                                    <input
                                                        style={{ paddingLeft: '5px' }}
                                                        placeholder="Number of days"
                                                        name="numberOfDays"
                                                        value={medicine.numberOfDays}
                                                        onChange={onMedicineChange}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <select
                                                        style={{ width: '200px', padding: '5px' }}
                                                        value={medicine.frequency}
                                                        onChange={onMedicineChange}
                                                        name="frequency"
                                                    >
                                                        <option value={0}>Frequency</option>
                                                        <option value="od">OD</option>
                                                        <option value="bd">BD</option>
                                                        <option value="tds">TDS</option>
                                                        <option value="sos">SOS</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-1" >
                                                    <Button color="danger" onClick={() => removeMedicine(medicine)}><CancelIcon /></Button>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )
                                }
                                <center><button type="button" className="btn btn-link" onClick={addNewMedicine}>Add new medicine</button></center>


                                <br />
                            </div>
                            <div className="form-group">
                                <label htmlFor="comment">General Remarks</label>
                                <textarea
                                    rows="2"
                                    className="form-control"
                                    name="generalRemarks"
                                    value={formData.generalRemarks}
                                    onChange={onChangeForm}
                                ></textarea>
                            </div>
                            <br />
                            Next Appointment Date &nbsp;
                            <Flatpickr
                                value={formData.nextAppointment ? formData.nextAppointment : new Date()}
                                onChange={onChangeDate}
                                options={{
                                    enableTime: false,
                                    altFormat: 'M j, Y',
                                    altInput: true,
                                    altInputClass: 'd-inline-block w-80 border border-secondary bg-light p-0 pl-2 ml-10',
                                    dateFormat: "d-m-Y",
                                }}
                            />
                        </div>
                        <hr />
                        <center><Button color="info" onClick={onSubmit} >Save Prescription</Button></center>
                        <br />
                    </div>
                    : null
            }
        </div>
    )
}

NewPrescription.propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    errors: PropTypes.object,
    user: PropTypes.object,
    patients: PropTypes.array,
    getAllPatients: PropTypes.func,
    savePrescription: PropTypes.func,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.invitation.errors,
    patients: state.auth.patients
});

export default connect(mapStateToProps, { getAllPatients, savePrescription })(NewPrescription);