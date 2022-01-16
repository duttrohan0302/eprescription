import React,{ useEffect,useState } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { getReceivedInvitations, acceptInvitation, rejectInvitation, suggestInInvitation } from "../Actions/invitationActions";
import moment from 'moment';

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

import {
    Col,
    Card,
    CardTitle,
    CardSubtitle,
    Button,
    Row,
    CardHeader,
    CardBody,
    Form,
    Input,
    Spinner,
    ModalHeader,
    Modal,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import store from "../Helpers/store";
import { setAlert } from "../Actions/alertActions";

const ModalSuggestion = ({suggestModal,toggleSuggestModal,id,suggestInInvitation}) => {

    const defaultDate = new Date((new Date(new Date().setMinutes(0)).setSeconds(0))).setMilliseconds(0)
    
    const[dateChanged,setDateChanged]=useState(false)
    const[suggestionMessage,setSuggestionMessage] = useState('')

    const[startDate,setStartDate] = useState(defaultDate)
    const[endDate,setEndDate] = useState(defaultDate)

    const onChangeStartDate = date => {
        setStartDate(date)
        setDateChanged(true)
    }
    const onChangeEndDate = date => {
        setEndDate(date)
        setDateChanged(true)
    }

    const onChange = (e) => {
        e.preventDefault();
        setSuggestionMessage(e.target.value)
    }

    const onSubmitSuggest = () =>{
        if(dateChanged){
            const msg = suggestionMessage+','+ new Date(startDate) +','+ new Date(endDate)
            console.log(msg)
            console.log((new Date(startDate)-new Date(endDate)))
            if((new Date(startDate)-new Date(endDate))>=0){
                console.log("Start Time cannot be less than or equal to end time")
                store.dispatch(setAlert('Start Time cannot be less than or equal to end time','danger',4000))
            }else{
                suggestInInvitation(id,msg)
            }
        }else{
            suggestInInvitation(id,suggestionMessage)
        }
        toggleSuggestModal();
    }  

    return(
        <Modal isOpen={suggestModal} toggle={toggleSuggestModal}>
            <ModalHeader toggle={toggleSuggestModal}>Suggestion</ModalHeader>
            <ModalBody>
                <div>
                    <Input type="text" name="suggestionMessage" value = {suggestionMessage} onChange={onChange} placeholder="Suggest Something" required/>
                    {/* <label className="d-block mb-0 pb-0">Suggest another time</label> */}
                    <small className="d-inline-block w-50">Suggest Start time</small>
                    <small className="d-inline-block w-50">Suggest End time</small>
                    <Flatpickr
                            // data-enable-time
                            value={startDate}
                            onChange={onChangeStartDate}
                            options={{
                                enableTime:true,
                                altFormat:'M j, Y h:i K',
                                altInput:true,
                                altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2 small',
                                dateFormat:"d-m-Y H:i",
                                minuteIncrement:30,
                            }}
                    />
                    <Flatpickr
                            data-enable-time
                            value={endDate}
                            onChange={onChangeEndDate}
                            options={{
                                altFormat:'M j, Y h:i K',
                                altInput:true,
                                dateFormat:"d-m-Y H:i",
                                altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2 small',
                                minuteIncrement:30,
                            }}
                    />
                </div>
                
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={onSubmitSuggest}>Suggest</Button>{' '}
            </ModalFooter>
        </Modal>
    )
}



const ReceivedInvitations = ({getReceivedInvitations,invitations,acceptInvitation,suggestInInvitation,rejectInvitation,loading})=> {

    useEffect(()=>{
        getReceivedInvitations();
    },[getReceivedInvitations])

    const [invitationId,setInvitationId]=useState(null)
    

    const [suggestModal, setSuggestModal] = useState(false);
    const toggleSuggestModal = (id) => {
        setInvitationId(id)
        setSuggestModal(!suggestModal);
    }


    const invitationContent = (invitations && invitations.length) ? invitations.map(((invitation,index)=>{
        
        const onSubmitReject = (event) =>{
            event.preventDefault();
            rejectInvitation(invitation._id,event.target.rejectionMessage.value)
        }  
        let recurringIn,recur2,recur;
        if(invitation.event){
            recurringIn = invitation.event.dates.length >=2 ? ((new Date(invitation.event.dates[1].startTime)).getTime()-(new Date(invitation.event.dates[0].startTime)).getTime())/(1000*3600*24) : 0
            recur2 = invitation.event.dates.length >=3 ? ((new Date(invitation.event.dates[2].startTime)).getTime()-(new Date(invitation.event.dates[1].startTime)).getTime())/(1000*3600*24) : -1
            recur = recur2!==-1 ? Math.min(recurringIn,recur2) : recurringIn
        }
        return (
            invitation.event ?
            <Col lg="4" md="6" sm="6" className="mt-2 mb-2" key={index}>
                <Card style={{borderColor: '#333'}}>
                    <CardHeader><b>{invitation.event.name || ''}</b></CardHeader>
                    <CardBody  className="p-2">
                        <CardTitle>Description: {invitation.event.description}</CardTitle>
                        <CardSubtitle>Invited by <b>{invitation.fromUser.name}</b>({invitation.fromUser.email})</CardSubtitle>
                        <CardTitle>Meeting Timings:
                            <br />
                            <Flatpickr
                                value={new Date(invitation.event.dates[0].startTime)}
                                disabled={true}
                                key={index}
                                options={{
                                    enableTime:true,
                                    altFormat:'M j, Y h:i K',
                                    altInput:true,
                                    altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2',
                                    dateFormat:"d-m-Y H:i",
                                    minuteIncrement:30,
                                }}
                            />
                            <Flatpickr
                                value={new Date(invitation.event.dates[0].endTime)}
                                disabled={true}
                                key={index}
                                options={{
                                    enableTime:true,
                                    altFormat:'M j, Y h:i K',
                                    altInput:true,
                                    altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2',
                                    dateFormat:"d-m-Y H:i",
                                    minuteIncrement:30,
                                }}
                            />
                            {/* {moment(invitation.event.dates[0].startTime).format('DD/MM/YYYY h:mm:ssA') } - {moment(invitation.event.dates[0].endTime).format('DD/MM/YYYY h:mm:ssA') } */}
                            {

                                invitation.event.dates.length>=2 ?
                                <>
                                    <br />
                                    Recurring in {
                                        Math.round(recur)
                                    } days
                                </>
                                :null
                            }
                        </CardTitle>
                    </CardBody>
                    <Button color="success" className="" style={{borderRadius:'0'}} onClick={()=>acceptInvitation(invitation._id)}>Accept</Button>
                    
                    <Button color="warning" className="" onClick={()=>{toggleSuggestModal(invitation._id)}}>Suggest</Button>

                    {/* <Form inline onSubmit={onSubmitSuggest}>
                        <Input type="text" name="suggestionMessage" placeholder="Suggest Something" style={{width:'60%'}}/>
                           <Button color="warning" className="" style={{borderRadius:'0', width:'40%'}}>Suggest</Button>
                    </Form> */}
                    <Form inline onSubmit={onSubmitReject}>
                        <Input type="text" name="rejectionMessage" placeholder="Reject with Message" style={{width:'60%'}}/>
                        <Button color="danger" className="" style={{borderRadius:'0', width:'40%'}} >Reject</Button>
                    </Form>
                </Card>
            </Col>
            :null
        )})) : <div><h3>No Unvisited Appointment Requests</h3></div>


    return(
        loading ? <Spinner /> :
        <Row>
            <ModalSuggestion
                toggleSuggestModal={toggleSuggestModal}
                suggestModal={suggestModal}
                id={invitationId}
                suggestInInvitation={suggestInInvitation}
            />
            {invitationContent}
        </Row>
    )
}

ReceivedInvitations.propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    getReceivedInvitations: PropTypes.func,
    acceptInvitation: PropTypes.func,
    rejectInvitation: PropTypes.func,
    suggestInInvitation: PropTypes.func,
    errors: PropTypes.object,
    invitations: PropTypes.array,
    loading: PropTypes.bool
};
  
const mapStateToProps = (state) => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.invitation.errors,
    invitations: state.invitation.invitations,
    loading: state.invitation.loading
});
  
export default connect(mapStateToProps,{getReceivedInvitations,acceptInvitation,rejectInvitation,suggestInInvitation})(ReceivedInvitations);