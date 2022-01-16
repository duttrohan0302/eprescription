import React,{ useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Spinner} from 'reactstrap';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interationPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import { getMyCalendar,createCalendar,deleteEvent,updateEvent } from '../Actions/eventActions';
import { sendInvitation,deleteInvitation } from '../Actions/invitationActions';

import { slugify } from '../Utils/slugify';
import EventModal from './EventModal';


const CalendarComponent = ({getMyCalendar,events,slug,createCalendar,errors,deleteEvent,loading,user,sendInvitation,updateEvent,deleteInvitation}) => {

  useEffect(()=>{
    if(user.userRole!=='admin'){
      setTimeout(()=>{getMyCalendar()},1)
    }
  },[getMyCalendar])
  const [ slugName,setSlugName ] = useState('');

  const onChange = e => {
    setSlugName(e.target.value)
  }
  const [modal, setModal] = useState(false);

  const [currentEvent,setCurrentEvent] = useState({
    name: '',   
    description: '',
    startTime:new Date(),
    endTime:new Date(),
    recurringIn:'0'
  });

  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const toggleInvitation = () => setIsInvitationOpen(!isInvitationOpen);

  const [invitePeople, setInvitePeople] = useState(false);
  const toggleInvitePeople = () => setInvitePeople(!invitePeople);

  const toggle = () => {
    setModal(!modal);
    setIsInvitationOpen(false);
    setInvitePeople(false);
  }

  const getEvent = (eventInfo) => {
    let event ={
      id: eventInfo.event.id,
      name: eventInfo.event.title,
      startTime: new Date(eventInfo.event.start),
      endTime: new Date(eventInfo.event.end),
      dateId:eventInfo.event.extendedProps.dateId,
      description: eventInfo.event.extendedProps.description,
      recurringIn: eventInfo.event.extendedProps.recurringIn,
      invitation: eventInfo.event.extendedProps.invitation
    }
    setCurrentEvent(event)
    toggle();

  }
  return(
    <div style={{width:'100%'}}>
      {
        loading ?
          <Spinner />
          :
          (
            slug 
          ? 
          <h2 className="text-center">{slug}</h2>
          :
          <div className="form-group" style={{marginTop:'10px'}}>
            <input
              type="text"
              placeholder="Unique Calendar slug eg: username-number"
              className={ 
                (errors && errors.slug) ?
                "form-control form-control-lg is-invalid "
                : "form-control form-control-lg" 
              }
              name="slugName"
              value={slugName}
              onChange={onChange}
              style={{width:'70%',display:'inline-block',marginRight:'20px'}}
            />
            
          <Button color="success" onClick={()=>{createCalendar(slugify(slugName))}} size="lg">Create Calendar</Button>
              <p>
                {
                  errors && errors.slug &&
                  <small className="text-danger">{errors.slug}</small>
                }
                { slugify(slugName) && 
                  <>
                    <p className="text-info d-inline">{' '}Your slug is: </p>
                    <p className="text-success d-inline">{slugify(slugName)}</p>
                  </>
                }
              </p>
          </div> 
          )
      }
               
        <EventModal 
          event={currentEvent} 
          setCurrentEvent={setCurrentEvent}
          toggle={toggle} 
          modal={modal} 
          deleteEvent={deleteEvent} 
          user={user}
          isInvitationOpen ={isInvitationOpen}
          toggleInvitation ={toggleInvitation}
          invitePeople={invitePeople}
          toggleInvitePeople={toggleInvitePeople}
          sendInvitation = {sendInvitation}
          errors={errors}
          updateEvent={updateEvent}
          deleteInvitation={deleteInvitation}
          />
        {
          slug ?
          <FullCalendar
            // dateClick={getDate}
            height='600px'
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            }}
            events={events ? events : null}
            plugins={[ dayGridPlugin, interationPlugin, timeGridPlugin,listPlugin ]}
            initialView="dayGridMonth"
            selectable={true}
            eventClick={getEvent}
          />
          :
          null
        }
        
      </div>
  )
}

CalendarComponent.propTypes = {
  user: PropTypes.object,
  getMyCalendar: PropTypes.func.isRequired,
  sendInvitation: PropTypes.func.isRequired,
  createCalendar: PropTypes.func.isRequired,
  deleteInvitation: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  updateEvent: PropTypes.func.isRequired,
  events: PropTypes.array,
  isAuthenticated: PropTypes.bool,
  slug: PropTypes.string,
  errors: PropTypes.object,
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  events: state.event.events,
  slug: state.event.slug,
  errors: state.event.errors,
  loading: state.event.loading
});

export default connect(mapStateToProps,{getMyCalendar,createCalendar,deleteEvent,sendInvitation,updateEvent,deleteInvitation})(CalendarComponent);
