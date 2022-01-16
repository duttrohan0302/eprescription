import React,{ useState, useEffect} from 'react';
import { getAllDoctors,getDoctorFeedback } from "../Actions/authActions";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {Button,Progress} from 'reactstrap';

const ViewFeedbacks = ({getAllDoctors,getDoctorFeedback,doctors,doctorsFeedback}) => {

    const [selectedOption,setSelectedOption] = useState(0)
    const [averages,setAverages] = useState({
        q1:0,
        q2:0,
        q3:0,
        q4:0,
        q5:0
    })
    // const [doctors,setDoctors] = useState(null)
    const onChangeOption = (e) => {
        console.log(e.target.value)
        setSelectedOption(e.target.value)
    }
    useEffect(()=>{
        getAllDoctors();

    },[getAllDoctors])
    useEffect(()=>{
        let s1=0,s2=0,s3=0,s4=0,s5=0
        if(doctorsFeedback && doctorsFeedback.value!=="0"){
            console.log(doctorsFeedback)
            doctorsFeedback.forEach((feedback)=>{
            s1+=feedback.q1;
            s2+=feedback.q2;
            s3+=feedback.q3;
            s4+=feedback.q4;
            s5+=feedback.q5;
        })
        const len = doctorsFeedback.length
        setAverages({
            q1:s1/len,
            q2:s2/len,
            q3:s3/len,
            q4:s4/len,
            q5:s5/len,
        })
        }
    },[doctorsFeedback])
    return(
        <div>
            <select onChange={onChangeOption} style={{padding:5,margin:5,width:500}}>
                <option value={0} style={{padding:5,margin:5}}>Select Doctor</option>
                {
                    doctors &&
                    doctors.map(doctor=> <option value={doctor._id}>{doctor.name}</option>)
                }
            </select>
            <Button color="success" disabled={!selectedOption} style={{marginLeft:50,height:35,width:100}} onClick={()=>getDoctorFeedback(selectedOption)}>Go</Button>
            {
                (doctorsFeedback && doctorsFeedback.length) ?
                <div>    
                    <div style={{marginTop:20}}>
                        <h4 className="section-title">Rate doctor's punctuality on the scale from 1 to 5.</h4>
                        <Progress striped value={averages.q1*20} color="success" >{averages.q1.toFixed(2)}</Progress>

                        <h4 className="section-title" style={{marginTop:20}}>Was the doctor able to treat every symptom?</h4>
                        <Progress striped value={averages.q2*20} color="info">{averages.q2.toFixed(2)}</Progress>

                        <h4 className="section-title" style={{marginTop:20}}>How was doctor's behaviour(Rate from 1 to 5)?</h4>
                        <Progress striped value={averages.q3*20} color="secondary">{averages.q3.toFixed(2)}</Progress>

                        <h4 className="section-title" style={{marginTop:20}}>Were the prescriptions given helpful?</h4>
                        <Progress striped value={averages.q4*20} color="warning">{averages.q4.toFixed(2)}</Progress>

                        <h4 className="section-title" style={{marginTop:20}}>How was the overall experience with the doctor?</h4>
                        <Progress striped value={averages.q5*20} color="info">{averages.q5.toFixed(2)}</Progress>
                    </div>
                    <div style={{marginTop:30}}>
                        <h3 className="section-title">Comments</h3>
                        {
                            doctorsFeedback.map((feedback,index)=><li key={index}>{feedback.comments}</li>)
                        }
                    </div>
                </div>
                :
                <div style={{marginTop:'10px'}}>No Feedbacks to show</div>
            }
        </div>
    )
}

ViewFeedbacks.propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    errors: PropTypes.object,
    user: PropTypes.object,
    getAllDoctors: PropTypes.func,
    getDoctorFeedback: PropTypes.func,
    doctors: PropTypes.object,
    doctorsFeedback: PropTypes.array
};
  
const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.invitation.errors,
    doctors: state.auth.doctors,
    doctorsFeedback: state.auth.doctorsFeedback
});
  
export default connect(mapStateToProps,{getAllDoctors,getDoctorFeedback})(ViewFeedbacks);