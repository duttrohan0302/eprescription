import React,{ useState,useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interationPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Flatpickr from "react-flatpickr";

import {
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    Collapse,
    Card,
    CardTitle,
    CardHeader
} from 'reactstrap';
import { useLocation } from 'react-router';
import { getCalendarBySlug, createEvent } from '../Actions/eventActions';
import store from '../Helpers/store';
import { setAlert } from '../Actions/alertActions';
import { sendInvitation } from '../Actions/invitationActions';
import SlotModal from './SlotModal';


const EventModal = ({modal,toggle,event,cal,user,toggleInvitation,isInvitationOpen,isAuthenticated}) => {
    let content = <div></div>
    if(event){ 
      const { name,startTime,endTime,invitation } = event;

      content = (
        // Modal for showing, event details
        <Modal isOpen={modal} toggle={toggle} >
          <ModalHeader toggle={toggle}>Meeting Details</ModalHeader>
          <ModalBody>
            <label>Calendar Slug</label>
            <div className="form-group">
              <input
                type="text"
                className={ 
                  "form-control" 
                }
                name="calSlug"
                value={cal.slug}
                disabled
              />
            </div>
            {
            (isAuthenticated && invitation) && 
              <div className="form-group">
                <label>Meeting Title</label>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Meeting Title"
                    className={ 
                      "form-control" 
                    }
                    name="name"
                    value={name}
                    disabled
                  />
                </div>
              </div>
            }
            <div className="d-inline-block w-50">Start Time</div>
            <div className="d-inline-block w-50">End Time</div>
            <Flatpickr
              // data-enable-time
              value={startTime}
              disabled={true}
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
              data-enable-time
              value={endTime}
              disabled={true}
              options={{
                  altFormat:'M j, Y h:i K',
                  altInput:true,
                  dateFormat:"d-m-Y H:i",
                  altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2',
                  minuteIncrement:30,
              }}
            />            
            {
              (invitation && user) ?
                <div className="mt-2">
                    {/* Invitation exists, show details */}
                  <p>This meeting is part of an invitation
                  <Button color="info" className="float float-right" onClick={toggleInvitation}>Details</Button>
                  </p>
                  <Collapse isOpen={isInvitationOpen}>
                    <Card className="mt-2">
                      <CardTitle  className="pl-2">
                        <b>Hosted by:</b>
                        <br />
                        
                        {invitation.host.email===user.email ? 
                        'You' :
                        `${invitation.host.name}(${invitation.host.email})`
                        }
                        </CardTitle>
                        <CardTitle className="pl-2">Attendees:</CardTitle>
                        {
                          invitation.attendees.map((attendee,index)=>
                            <CardHeader key={index}>
                              <small>
                                {attendee.email===user.email ? 'You' :
                                `${attendee.name}(${attendee.email})`
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
                                    }> {attendee.action.replace(/\b\w/g, l => l.toUpperCase()).split(' ')[0]}
                                    {
                                        attendee.action.includes('rejected') ? 
                                            '\n' + attendee.action.substr(attendee.action.indexOf(' ')+1) +'\n'
                                        :
                                        (attendee.action.includes('suggestion') ? (
                                            attendee.action.split(',').map((element,index)=>{
                                                if(index===0){
                                                    return <span key={index}><br />{'\n' + element.substr(11)}</span>
                                                }else if(index===1 || index===2){
                                                   
                                                    return(
                                                        <Flatpickr
                                                                key={index}
                                                                value={new Date(element)}
                                                                disabled={true}
                                                                options={{
                                                                    enableTime:true,
                                                                    altFormat:'M j, Y h:i K',
                                                                    altInput:true,
                                                                    altInputClass:'d-inline-block w-100 border border-secondary bg-light rounded pl-2',
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
                    </Card>
                  </Collapse>
                </div>
              : 
              null
            }
            
          </ModalBody>
        </Modal>
      )
    }
  
    return <div>{content}</div>;
  }

const FriendCalendar = ({ isAuthenticated,events, cal,getCalendarBySlug,slug,newEvent,errors,sendInvitation,createEvent,user,slots}) => {

    const { pathname } = useLocation();
    const calSlug = pathname.split('/')[pathname.split('/').length-1]

    const [modal, setModal] = useState(false);

    const [currentEvent,setCurrentEvent] = useState(null);

    const toggle = () => setModal(!modal);

    const [createModal, setCreateModal] = useState(false);

    const[creatingEvent,setCreatingEvent] = useState(false)
    const[recurringCheck,setRecurringCheck] = useState(false)

    const [isInvitationOpen, setIsInvitationOpen] = useState(false);
    const toggleInvitation = () => setIsInvitationOpen(!isInvitationOpen);


    const defaultDate = new Date((new Date(new Date().setMinutes(0)).setSeconds(0))).setMilliseconds(0)

    const createModalToggle = () => {
      if(errors){
        delete errors['name']
        delete errors['startTime']
        delete errors['endTime']
        delete errors['time']
        delete errors['recurringIn']
        setCreatingEvent(false)
        setRecurringCheck(false)
      }
      setRecurringCheck(false)
      setCreateModal(!createModal)
      setCustomRecurring(false)
      
    };

    const [formData, setFormData] = useState({
        name: '',   
        description: '',
        startTime:defaultDate,
        endTime:defaultDate,
        recurringIn:'0'
      });

      useEffect(()=>{
        if(newEvent){
          setCreatingEvent(false);
          setRecurringCheck(false)
          createModalToggle();
          sendInvitation(newEvent[0].id,cal.email)
          setFormData({
            name: '',   
            description: '',
            startTime:defaultDate,
            endTime:defaultDate,
            recurringIn:'0'
          })
        }
        if(errors){
          if(errors){
            setCreatingEvent(false);
            setRecurringCheck(false)
          }
        }
      },newEvent,errors)
      
      const [customRecurring,setCustomRecurring] = useState(false)
      
      const onRecurring = (e) => {
        if(e.target.value==='daily'){
          setFormData({
            ...formData,
            recurringIn:1
          })
          setCustomRecurring(false)
        }else if(e.target.value==='weekly'){
          setFormData({
            ...formData,
            recurringIn:7
          })
          setCustomRecurring(false)
        }else if(e.target.value==='custom'){
          setCustomRecurring(true)
        }
      }

      const { name, description,startTime,endTime, recurringIn } = formData;


      const onChangeCheck = e => {
        setRecurringCheck(recurringCheck=> !recurringCheck)
        if(!recurringCheck){
          setFormData({...formData,recurringIn:0})
        }
      setCustomRecurring(false)

      }

      const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if(errors){
          delete errors[e.target.name]
        }
      }

      const onChangeStartDate = date => {
        setFormData({ ...formData, startTime:date });
        if(errors){
          delete errors['startTime']
          delete errors['time']
          delete errors['slot']

        }
      }
      const onChangeEndDate = date => {
          setFormData({ ...formData, endTime:date });
          if(errors){
            delete errors['endTime']
            delete errors['time']
            delete errors['slot']
          }
      }
      
      const onSubmit = (e) => {
        e.preventDefault();
          setCreatingEvent(true);
          const event = {
              name,description,startTime: new Date(startTime),endTime: new Date(endTime),recurringIn,slots
          }
          createEvent(event);
        
      };
      const [slotModal, setSlotModal] = useState(false);
      const toggleSlotModal = () => setSlotModal(!slotModal);

    const getDate = (arg) => {
      const dateTime = arg.date;
      const date = arg.dateStr
      setFormData({ ...formData, endTime:new Date(arg.date),startTime:new Date(arg.date)});

      if(isAuthenticated){
        // call function to create a meeting
        // console.log(slug)
        // console.log("creating a meeting")
        createModalToggle();
      }else{
        store.dispatch(setAlert(`You must be logged in to create a meeting with ${cal.name}`,'danger',4000))
      }
    }

    const getEvent = (eventInfo) => {
        let event ={
          id: eventInfo.event.id,
          name: eventInfo.event.title,
          startTime: new Date(eventInfo.event.start),
          endTime: new Date(eventInfo.event.end),
          invitation: eventInfo.event.extendedProps.invitation
          // description: eventInfo.event.extendedProps.description,
        }
        setCurrentEvent(event)
        toggle();
    
      }


    if(!cal){
        // history.push('/dashboard')
        getCalendarBySlug(calSlug);
        return(<div></div>)
    }else{
    
    
        return(
            <div style={{padding:'10px'}}>
                <EventModal 
                  event={currentEvent} 
                  toggle={toggle} 
                  modal={modal} 
                  setModal={setModal} 
                  cal={cal} 
                  user={user}
                  toggleInvitation={toggleInvitation}
                  isInvitationOpen={isInvitationOpen}
                  isAuthenticated={isAuthenticated}
                />
                <Button disabled>Click on a day to create a meeting with {cal.name}</Button>
                {
                  isAuthenticated && <Button className="d-inline-block float float-right" color="info" onClick={toggleSlotModal}>View Slots </Button>
                }
                {
                  slots ?
                    <SlotModal 
                      slots={slots}
                      toggle={toggleSlotModal}
                      modal={slotModal}
                    />
                    :null
                }
                {
                  isAuthenticated &&
                  <Modal isOpen={createModal} toggle={createModalToggle} >
                    <ModalHeader toggle={createModalToggle}>Create Meeting</ModalHeader>
                    <ModalBody>
                      <p>After the event is successfully created, an invitation will be sent out to {cal.name}</p>
                      <div className="event-form">
                        <form className="login-form" id="login-form" noValidate 
                        onSubmit={onSubmit}
                        >
                        <label>This meeting shall be created in your calendar</label>
                          
                            <div className="form-group">
                                <input
                                  type="text"
                                  placeholder="Your Meeting Title"
                                  className={ 
                                    (errors && errors.name) ?
                                    "form-control is-invalid"
                                    : "form-control" 
                                  }
                                  name="name"
                                  value={name}
                                  onChange={onChange}
                                />
                                {
                                  errors && errors.name &&
                                  <small className="text-danger">{errors.name}</small>
                                }
                            </div>
                            <div className="form-group">
                                <textarea
                                  type="text"
                                  placeholder="Description"
                                  className={ 
                                    (errors && errors.description) ?
                                    "form-control is-invalid"
                                    : "form-control" 
                                  }
                                  name="description"
                                  value={description}
                                  onChange={onChange}
                                  cols={60}
                                  rows={4}
                                />
                                {
                                  errors && errors.description &&
                                  <small className="text-danger">{errors.description}</small>
                                }
                            </div>
                            <div className="from-group">
                              <small className="text d-block">Please select start and end time</small>
                                <Flatpickr
                                        value={startTime}
                                        onChange={onChangeStartDate}
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
                                        data-enable-time
                                        value={endTime}
                                        onChange={onChangeEndDate}
                                        options={{
                                            altFormat:'M j, Y h:i K',
                                            altInput:true,
                                            dateFormat:"d-m-Y H:i",
                                            altInputClass:'d-inline-block w-50 border border-secondary bg-light rounded pl-2',
                                            minuteIncrement:30,
                                        }}
                                />
                            </div>
                            
                            <div className="form-group">
                                {
                                errors && errors.startTime &&
                                <small className="text-danger">{errors.startTime}</small>
                                }
                                <p></p>
                                {
                                errors && errors.endTime &&
                                <small className="text-danger">{errors.endTime}</small>
                                }
                                {
                                errors && errors.time &&
                                <small className="text-danger">{errors.time}</small>
                                }
                                {
                                  errors && errors.slot &&
                                  <small className="text-danger"><p></p>{errors.slot}</small>
                                }
                            </div>
                            
                              <div className="form-check">
                                <input
                                    className={ 
                                      "form-check-input" 
                                    }
                                    type="checkbox"
                                    value={recurringCheck}
                                    id="checkRecurring"
                                    style={{width:'20px'}}
                                    name="recurringCheck"
                                    onChange={onChangeCheck}
                                  />
                                <small>
                                  Check for recurring event
                                </small>
                                
                              </div>

                            {
                              recurringCheck &&
                                <div className="form-group" style={{marginTop:'10px'}}>
                                
                                  <small>Please enter the number of days, the meeting recurs in</small><p></p>
                                  <small>(0 for non-recurring meeting)</small>
                                  <div class="form-check">
                                    <label class="form-check-label">
                                      <input type="radio" class="form-check-input" name="recurringInterval" value={'daily'} onChange={onRecurring}/>Daily
                                    </label>
                                  </div>
                                  <div class="form-check">
                                    <label class="form-check-label">
                                      <input type="radio" class="form-check-input" name="recurringInterval" value={'weekly'} onChange={onRecurring}/>Weekly
                                    </label>
                                  </div>
                                  <div class="form-check">
                                    <label class="form-check-label">
                                      <input type="radio" class="form-check-input" name="recurringInterval" value={'custom'} onChange={onRecurring}/>Custom
                                    </label>
                                  </div>
                                  {
                                      customRecurring &&
                                    <>
                                      <input
                                        type="number"
                                        placeholder="Recurring in"
                                        className={ 
                                          (errors && errors.recurringIn) ?
                                          "form-control is-invalid"
                                          : "form-control" 
                                        }
                                        name="recurringIn"
                                        value={recurringIn}
                                        onChange={onChange}
                                      />
                                      <small>Number of days in which the meeting recurs</small>
                                    </>
                                  }
                                  {
                                    errors && errors.recurringIn &&
                                    <small className="text-danger">{errors.recurringIn}</small>
                                  }<p></p>
                                
                                
                                </div>
                            }
                            
                            <div className="form-group form-button">
                                <input type="submit" name="event" id="event" className="form-submit" value="Submit"/>
                                {
                                  creatingEvent &&
                                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                        </form>
                      </div>
                    </ModalBody>
                  </Modal>
                }
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-4 col-md-4 col-sm-12" style={{textAlign:'left'}}>
                            <h3>{cal.name}</h3>
                        </div>
                        <div className="col-4 col-md-4 col-sm-12" style={{textAlign:'center'}}>
                            <h3>{cal.slug}</h3>
                        </div>
                        <div className="col-4 col-md-4 col-sm-12" style={{textAlign:'right'}}>
                            <h3>{cal.email}</h3>
                        </div>
                    </div>
                </div>
                <FullCalendar
                    dateClick={getDate}
                    height='600px'
                    headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    }}
                    events={
                      events ? events
                      : null}
                    plugins={[ dayGridPlugin, interationPlugin, timeGridPlugin,listPlugin ]}
                    initialView="dayGridMonth"
                    selectable={true}
                    eventClick={getEvent}
                />
            </div>
        )
    }
    
}

FriendCalendar.propTypes = {
    auth: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    events: PropTypes.array,
    cal: PropTypes.object,
    getCalendarBySlug: PropTypes.func,
    createEvent: PropTypes.func,
    sendInvitation: PropTypes.func,
    newEvent: PropTypes.array,
    errors: PropTypes.object || PropTypes.bool,
    user: PropTypes.object,
    slots: PropTypes.object
};
  
const mapStateToProps = (state) => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated,
    events: state.event.friendEvents,
    cal: state.event.friendCalendar,
    newEvent: state.event.newEvent,
    errors: state.event.errors,
    user: state.auth.user,
    slots: state.event.friendSlots
});
  
  
export default connect(mapStateToProps,{getCalendarBySlug,createEvent,sendInvitation})(FriendCalendar);