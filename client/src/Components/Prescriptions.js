import React, { useState, useEffect } from 'react';
import { getPrescriptions } from "../Actions/authActions";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Button, Row, Col } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import { history } from '../Helpers';

const Prescriptions = ({ getPrescriptions, user, prescriptions, patientId ,location}) => {

    useEffect(() => {
        if (user.userRole === 'patient') {
            getPrescriptions(user.id)
        } else if(location.patientId) {
            getPrescriptions(location.patientId)
        } else{
            history.push('/dashboard')
        }
    }, [])

    return (
        <div >
            <div className="container-fluid" style={{ border: '3px black solid', marginTop: '30px', paddingBottom: '10px', borderRadius:'20px' }}>
                {/* <div className="row"> */}
                <div className="">
                    <h3 style={{  textAlign: 'center' }}>Jeevan Jyoti Hospital</h3>
                    <div className="container-fluid">

                        <div className="row">
                            <div className="col-md-7">
                                Patient Name: {user.name}
                            </div>
                            <div className="col-md-2">
                                Age: {user.age}
                            </div>
                            <div className="col-md-3">
                                Sex: {user.sex}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-7">
                                Phone: {user.phone}
                            </div>
                            <div className="col-md-5">
                                Email: {user.email}
                            </div>
                        </div>
                        <hr style={{ color: 'blue', height: '2px' }} />

                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                {
                    (prescriptions && prescriptions.length) ?
                        prescriptions.map((prescription, index) => {
                            const {  doctor, diagnosis, generalRemarks, nextAppointment, medicines, date } = prescription
                            return (
                                <div className="col-12" key={index} style={{width:'300px'}}>
                                    <div className="container" style={{ border: '3px black solid', marginTop: '30px', paddingBottom: '10px' }}>

                                        <div className="text-center">
                                            <h4>{doctor.name} </h4>
                                            <h4><small>{doctor.specialization}</small></h4>
                                        </div>
                                        <div className="prescription-form container-fluid">
                                            <div className="form-group">
                                                <label htmlFor="comment">Diagnosis</label>
                                                <textarea
                                                    rows="2"
                                                    className="form-control"
                                                    name="diagnosis"
                                                    value={diagnosis}
                                                    disabled={true}
                                                ></textarea>
                                            </div>
                                            <br />
                            Medicines
                            <div className="container-fluid">
                                                {
                                                    medicines.map((medicine, index) => {


                                                        return (
                                                            <div className="row">
                                                                <div className="col">
                                                                    <input
                                                                        style={{ paddingLeft: '5px' }}
                                                                        placeholder="Medicine Name"
                                                                        value={medicine.name}
                                                                        name="name"
                                                                        disabled={true}

                                                                    />
                                                                </div>

                                                                <div className="col">
                                                                    <input
                                                                        style={{ paddingLeft: '5px' }}
                                                                        placeholder="Number of days"
                                                                        name="numberOfDays"
                                                                        value={medicine.numberOfDays}
                                                                        disabled={true}

                                                                    />
                                                                </div>
                                                                <div className="col">
                                                                    <select
                                                                        style={{ width: '200px', padding: '5px' }}
                                                                        value={medicine.frequency}
                                                                        name="frequency"
                                                                        disabled={true}
                                                                    >
                                                                        <option value={0}>Frequency</option>
                                                                        <option value="od">OD</option>
                                                                        <option value="bd">BD</option>
                                                                        <option value="tds">TDS</option>
                                                                        <option value="sos">SOS</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    )
                                                }
                                                <br />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="comment">General Remarks</label>
                                                <textarea
                                                    rows="2"
                                                    className="form-control"
                                                    name="generalRemarks"
                                                    value={generalRemarks}
                                                    disabled={true}
                                                ></textarea>
                                            </div>
                                            <br />
                                                    Dated: <Flatpickr
                                                value={date}
                                                options={{
                                                    enableTime: false,
                                                    altFormat: 'M j, Y',
                                                    altInput: true,
                                                    altInputClass: 'd-inline-block w-80 border border-secondary bg-light p-0 pl-2',
                                                    dateFormat: "d-m-Y",
                                                }}
                                                disabled={true}
                                            />
                                            <span className="float float-right">
                                                Next Appointment Date &nbsp;
                            <Flatpickr
                                                    value={nextAppointment}
                                                    options={{
                                                        enableTime: false,
                                                        altFormat: 'M j, Y',
                                                        altInput: true,
                                                        altInputClass: 'd-inline-block w-80 border border-secondary bg-light p-0 pl-2 ml-10',
                                                        dateFormat: "d-m-Y",
                                                    }}
                                                    disabled={true}
                                                />
                                            </span>

                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        )

                        :
                        <div className="display-4">No Prescriptions to Display</div>

                }
                </div>  
                </div>
            </div>
            {/* </div> */}
        </div>
    )
}


Prescriptions.propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    errors: PropTypes.object,
    user: PropTypes.object,
    getPrescriptions: PropTypes.func,
    prescriptions: PropTypes.array
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.invitation.errors,
    prescriptions: state.auth.prescriptions
});

export default connect(mapStateToProps, { getPrescriptions })(Prescriptions);
