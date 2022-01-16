import React,{ useState, useEffect} from 'react';
import { getMyDoctors,submitFeedback } from "../Actions/authActions";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {Button} from 'reactstrap';

import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';


const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon />,
      label: 'Very Dissatisfied',
    },
    2: {
      icon: <SentimentDissatisfiedIcon />,
      label: 'Dissatisfied',
    },
    3: {
      icon: <SentimentSatisfiedIcon />,
      label: 'Neutral',
    },
    4: {
      icon: <SentimentSatisfiedAltIcon />,
      label: 'Satisfied',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon />,
      label: 'Very Satisfied',
    },
  };

const IconContainer = (props) => {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  
  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };


const NewFeedback = ({getMyDoctors,doctors,submitFeedback}) => {

    const [selectedOption,setSelectedOption] = useState(0)
    const [doctor,selectDoctor] = useState(null)
    const [rating,setRating] = useState({
        q1:0,
        q2:0,
        q3:0,
        q4:0,
        q5:0,
        comments:''
    })

    const onChangeTextArea = e => {
        setRating({...rating,comments:e.target.value})
    }
    const onRatingChange = (ques,e) => {
        setRating({...rating,[ques]:e.target.value})
    }

    const selectedDoctor = (id) => {
        selectDoctor(doctors.filter(doc=>doc._id===id)[0])
    }
    const onChangeOption = (e) => {
        // console.log(e.target.value)
        setSelectedOption(e.target.value)
    }
    useEffect(()=>{
        getMyDoctors();
    },[getMyDoctors])
    // console.log(doctors)

    const onSubmit = () => {
        rating.doctor = doctor._id;
        console.log(rating)
        submitFeedback(rating)
    }
    return(
        <div>
            <select onChange={onChangeOption} style={{padding:5,margin:5,width:500}}>
                <option value={0} style={{padding:5,margin:5}}>Select Doctor</option>
                {
                    doctors &&
                    doctors.map(doctor=> <option value={doctor._id}>{doctor.name}</option>)
                }
            </select>
            <Button color="success" disabled={!selectedOption} style={{marginLeft:50,height:35,width:100}} onClick={()=>selectedDoctor(selectedOption)}>Go</Button>
            <div>
                {
                    doctor ?
                    <div>    
                        <div style={{marginTop:20}}>
                            <h4 className="section-title">Rate doctor's punctuality.</h4>
                            <Box component="fieldset" borderColor="transparent">
                                <Rating
                                name="customized-icons1"
                                value={rating.q1}
                                // getLabelText={(value) => customIcons[value].label}
                                IconContainerComponent={IconContainer}
                                onChange={(e)=>onRatingChange('q1',e)}
                                />
                            </Box>
                            <h4 className="section-title" style={{marginTop:20}}>Was the doctor able to treat every symptom?</h4>
                            <Box component="fieldset" borderColor="transparent">
                                <Rating
                                name="customized-icons2"
                                value={rating.q2}
                                // getLabelText={(value) => customIcons[value].label}
                                IconContainerComponent={IconContainer}
                                onChange={(e)=>onRatingChange('q2',e)}
                                />
                            </Box>
                            <h4 className="section-title" style={{marginTop:20}}>How was doctor's behaviour(Rate from 1 to 5)?</h4>
                            <Box component="fieldset" borderColor="transparent">
                                <Rating
                                name="customized-icons3"
                                value={rating.q3}
                                // getLabelText={(value) => customIcons[value].label}
                                IconContainerComponent={IconContainer}
                                onChange={(e)=>onRatingChange('q3',e)}
                                />
                            </Box>
                            <h4 className="section-title" style={{marginTop:20}}>Were the prescriptions given helpful?</h4>
                            <Box component="fieldset" borderColor="transparent">
                                <Rating
                                value={rating.q4}
                                name="customized-icons4"
                                // getLabelText={(value) => customIcons[value].label}
                                IconContainerComponent={IconContainer}
                                onChange={(e)=>onRatingChange('q4',e)}
                                />
                            </Box>
                            <h4 className="section-title" style={{marginTop:20}}>How was the overall experience with the doctor?</h4>
                            <Box component="fieldset" borderColor="transparent">
                                <Rating
                                value={rating.q5}
                                name="customized-icons5"
                                // getLabelText={(value) => customIcons[value].label}
                                IconContainerComponent={IconContainer}
                                onChange={(e)=>onRatingChange('q5',e)}
                                />
                            </Box>
                        </div>
                        <div style={{marginTop:30}}>
                            <h3 className="section-title">Comments</h3>
                            <textarea
                            placeholder="Please help us with your valuable feedback"
                            cols={100}
                            rows={4}
                            onChange={onChangeTextArea}
                            value={rating.comments}
                            />
                        </div>
                        <Button color="info" onClick={onSubmit}>Submit</Button>
                    </div>
                    :null
                }
                
            </div>
        </div>
    )
}

NewFeedback.propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    errors: PropTypes.object,
    user: PropTypes.object,
    getMyDoctors: PropTypes.func,
    submitFeedback: PropTypes.func,
    doctors: PropTypes.object,
};
  
const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.invitation.errors,
    doctors: state.auth.doctors,
});
  
export default connect(mapStateToProps,{getMyDoctors,submitFeedback})(NewFeedback);