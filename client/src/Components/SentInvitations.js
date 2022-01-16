import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { useEffect } from "react";
import { getSentInvitations } from "../Actions/invitationActions";
import Flatpickr from "react-flatpickr";

import {
    Col,
    Card,
    CardTitle,
    Row,
    CardHeader,
    CardBody,
    Spinner
} from 'reactstrap';
const SentInvitations = ({getSentInvitations,invitations,loading})=> {
    useEffect(()=>{
        getSentInvitations();
    },[getSentInvitations])
    const invitationContent = (invitations && invitations.length) ? invitations.map(((invitation,index)=>{
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
                    <CardHeader style={{backgroundColor:'#444747',color:'white'}}><b>{invitation.event.name}</b></CardHeader>
                    <CardBody  className="p-0">
                        <CardTitle className="p-2">Description: {invitation.event.description}</CardTitle>
                        {/* <CardSubtitle>Invited by <b>{invitation.fromUser.name}</b></CardSubtitle> */}
                        <CardTitle className="pl-2 pr-2">Meeting Timings:
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
                        <CardTitle className="pl-2 pr-2">Responses: </CardTitle>
                        {
                            
                            invitation.actedUpon.map((attendee,index)=>
                            <CardHeader key={index}>
                              <small>
                                {
                                `${attendee.user.name}(${attendee.user.email})`
                                }
                                 -  
                                <span 
                                  className=
                                    {
                                      attendee.action==='accepted' ? 
                                      'text-success' : 
                                      (
                                        (attendee.action.includes('rejected') || attendee.action==='deleted') ? 
                                        'text-danger' :
                                        (attendee.action.includes('suggestion') ? 'text-info' : '')
                                      )
                                    }>
                                        {attendee.action.replace(/\b\w/g, l => l.toUpperCase()).split(' ')[0]}
                                        {
                                            attendee.action.includes('rejected') ? 
                                                '\n' + attendee.action.substr(attendee.action.indexOf(' ')+1) +'\n'
                                            :
                                            (attendee.action.includes('suggestion') ? (
                                                attendee.action.split(',').map((element,index)=>{
                                                    if(index===0){
                                                        return <span key={index}><br />{'\n' + element.substr(11)}<br /></span>
                                                    }else if(index===1 || index===2){
                                                        return(
                                                            <Flatpickr
                                                                    value={new Date(element)}
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
                                                        )
                                                    }
                                                })
                                            ) : null)
                                        }
                                    </span>
                              </small>
                            </CardHeader>
                            )
                        }
                    </CardBody>
                </Card>
            </Col> :null
        )})) : <div><h3>No Sent Appointment Requests yet</h3></div>


    return(
        loading ? <Spinner /> :
        <Row>
            {invitationContent}
        </Row>
    )
}

SentInvitations.propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    getSentInvitations: PropTypes.func,
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
  
export default connect(mapStateToProps,{getSentInvitations})(SentInvitations);