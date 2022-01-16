import api from '../Utils/api';
import { setAlert } from './alertActions';

import {
    CREATE_CAL_SUCCESS,
    CREATE_CAL_FAIL,
    GET_SELF_CAL_SUCCESS,
    GET_SELF_CAL_FAIL,
    CREATE_EVENT_SUCCESS,
    CREATE_EVENT_FAIL,
    DELETE_EVENT_SUCCESS,
    DELETE_EVENT_FAIL,
    GET_OTHERS_CAL_SUCCESS,
    GET_OTHERS_CAL_FAIL,
    CAL_LOADING,
    CAL_LOADING_STOP,
    UPDATE_EVENT_SUCCESS,
    UPDATE_EVENT_FAIL, 
    GET_SLOTS_SUCCESS,
    GET_SLOTS_FAIL,
    SET_SLOTS_SUCCESS,
    SET_SLOTS_FAIL
} from './types';
import { history } from '../Helpers';

// Create calendar
export const createCalendar = (slugName) => async dispatch => {

  try{
    const res = await api.post('/calendar',{slug:slugName});

    if(res.data){
      dispatch({
        type: CREATE_CAL_SUCCESS,
        payload: res.data
      })

      dispatch(getMyCalendar());
      dispatch(setAlert('Calendar slug created successfully, now you can add meetings','success',4000))
    }
  } catch(err){
    if(err.response){

      dispatch({
        type: CREATE_CAL_FAIL,
        payload: err.response.data
      })
    }
  }
} 

// Get self calendar 
export const getMyCalendar = () => async dispatch => {
  dispatch({type:CAL_LOADING})
  try {
    const res = await api.get('/calendar');
    let eventArray=[]
    if(!res.data){
      dispatch({type:CAL_LOADING_STOP})

      dispatch(setAlert('Create a calendar first','warning',4000))
    }
      res.data.events.forEach(event=>{
        const recurringIn = event.dates.length >=2 ? ((new Date(event.dates[1].startTime)).getTime()-(new Date(event.dates[0].startTime)).getTime())/(1000*3600*24) : 0
        const recur2 = event.dates.length >=3 ? ((new Date(event.dates[2].startTime)).getTime()-(new Date(event.dates[1].startTime)).getTime())/(1000*3600*24) : -1
        const recur = recur2!==-1 ? Math.min(recurringIn,recur2) : recurringIn
        let addEvent={
          id: event._id,
          title: event.name,
          description: event.description,
          recurringIn: Math.round(recur),
          invitation: 
            event.invitation ? 
            {
              id: event.invitation._id,
              host: {
                email: event.invitation.fromUser.email,
                name: event.invitation.fromUser.name
              },
              attendees: event.invitation.actedUpon.map(user=>{return{
                name: user.user.name,
                email: user.user.email,
                action: user.action
              }})
              
            } : null
        }
        event.dates.forEach(date=> {
          eventArray.push({
            ...addEvent,start:date.startTime,end:date.endTime,dateId:date._id
          })
        })

      })
    dispatch({
      type: GET_SELF_CAL_SUCCESS,
      payload: {eventArray,slug:res.data.slug,slots:res.data.slots}
    });
    dispatch({type:CAL_LOADING_STOP})

    
  } catch (err) {
    if(err.reponse){
      const errors = err.response.data;
      if(errors){
        if(typeof(errors)==='object'){
          for (const [key, value] of Object.entries(errors)) {
            dispatch(setAlert(`${value}`, 'danger'))
          }
        } else {
          dispatch(setAlert(`${errors}`, 'danger'))
        }
      }
    }

    

    dispatch({
      type: GET_SELF_CAL_FAIL
    });
  }
};

// Get calendar by slug
export const getCalendarBySlug = (slug,userId) => async dispatch => {

  try{
    const res = await api.get(`/calendar/${slug}`)
    let eventArray=[];
    const calendar={
      email:res.data.user.email,
      name:res.data.user.name,
      slug:res.data.slug
    }
    if(res.data.events){
      res.data.events.forEach(event=>{
        const recurringIn = event.dates.length >=2 ? ((new Date(event.dates[1].startTime)).getTime()-(new Date(event.dates[0].startTime)).getTime())/(1000*3600*24) : 0
        const recur2 = event.dates.length >=3 ? ((new Date(event.dates[2].startTime)).getTime()-(new Date(event.dates[1].startTime)).getTime())/(1000*3600*24) : -1
        const recur = recur2!==-1 ? Math.min(recurringIn,recur2) : recurringIn
        let addEvent={
          id: event._id,
          title: event.name,
          description: event.description,
          recurringIn:Math.round(recur),
          invitation: 
            (event.invitation && ( (userId===event.invitation.fromUser._id)|| (event.invitation.actedUpon.filter(people=> people.user._id===userId)))) ?
            {
              id: event.invitation._id,
              host: {
                email: event.invitation.fromUser.email,
                name: event.invitation.fromUser.name
              },
              attendees: event.invitation.actedUpon.map(user=>{return{
                name: user.user.name,
                email: user.user.email,
                action: user.action
              }})
              
            } : null
        }
        event.dates.forEach(date=> {
          eventArray.push({
            ...addEvent,start:date.startTime,end:date.endTime,dateId:date._id
          })
        })
  
      })
    }
    dispatch({
      type: GET_OTHERS_CAL_SUCCESS,
      payload:{calendar,events:eventArray,slots:res.data.slots}
    })
    history.push(`/calendar/${calendar.slug}`)
    
  } catch(err){
    if(err.response){
      dispatch({
        type:GET_OTHERS_CAL_FAIL
      })
      dispatch(setAlert(err.response.data.slug,'danger',4000))
      history.push('/')
    }

  }
}
// Create event
export const createEvent = (eventObject) => async dispatch => {
  try{
    const res = await api.post('/events',eventObject);
    const event = res.data;
    let eventArray=[]
    const recurringIn = event.dates.length >=2 ? ((new Date(event.dates[1].startTime)).getTime()-(new Date(event.dates[0].startTime)).getTime())/(1000*3600*24) : 0
    const recur2 = event.dates.length >=3 ? ((new Date(event.dates[2].startTime)).getTime()-(new Date(event.dates[1].startTime)).getTime())/(1000*3600*24) : -1
    const recur = recur2!==-1 ? Math.min(recurringIn,recur2) : recurringIn
      let addEvent={
        id: event._id,
        title: event.name,
        description: event.description,
        recurringIn: Math.round(recur)
      }
      event.dates.forEach(date=> {
        eventArray.push({
          ...addEvent,start:date.startTime,end:date.endTime,dateId:date._id
        })
      })
    dispatch({
      type: CREATE_EVENT_SUCCESS,
      payload: eventArray
    });
    dispatch(setAlert("Meeting created successfully",'success'));

  }catch(err){
    if(err.response){
      const errors = err.response.data;


      dispatch({
        type: CREATE_EVENT_FAIL,
        payload: errors
      });
    }
    
  }
}

export const updateEvent = (event,changeDate,dateId) => async dispatch => {
  try{
    const body = {
      name: event.name,
      description:event.description,
      dateId: changeDate ? dateId : null,
      newStartTime: event.startTime,
      newEndTime: event.endTime
    }
    // Send updated event Date and time too
    const res = await api.patch(`/events/${event.id}`,body)
    const payload = res.data.event ? res.data : {event:res.data}
    payload.dateId = changeDate ? dateId : null;
    dispatch(setAlert('Meeting Updated Successfully','success',4000))
    dispatch({
      type:UPDATE_EVENT_SUCCESS,
      payload: payload
    })
  }catch(err){
    if(err.response){
      if(err.response.data && typeof(err.response.data==='object')){
        Object.keys(err.response.data).forEach(function (key){
          dispatch(setAlert(err.response.data[key],'danger',4000))
        });
      }
      dispatch({
        type: UPDATE_EVENT_FAIL,
        payload: err.response.data
      })
    }
    
  }
}
// Delete Event
export const deleteEvent = (id,dateId=null) => async dispatch => {

  try{
    const body = {
      deleteOneInRecurring : dateId ? true : false ,
      dateId
    }
    const res = await api.delete(`/events/${id}`, {data: body})
    if(res.data){
      dispatch(setAlert('Meeting Deleted Successfully','success',4000))
      dispatch({
        type:DELETE_EVENT_SUCCESS,
        payload: {id,dateId}
      })
    }

  }catch(err){
    if(err.response){
      dispatch(setAlert(err.response.data,'danger',4000))
    }
    dispatch({
      type: DELETE_EVENT_FAIL
    })
  }

}

export const setSlots = (slots) => async dispatch => {
  try{
    const res = await api.patch('/calendar/slots',{slots});
    console.log(res)
    dispatch({
      type:SET_SLOTS_SUCCESS,
      payload:res.data
    })
    dispatch(setAlert('Free slots updated','success',4000))
  }catch(err){
    console.log(err.response)
    if(err.response.data){
      dispatch({
        type:SET_SLOTS_FAIL,
        payload:err.response.data
      })
    }
  }
}

export const getSlots = () => async dispatch => {
  try{
    const slots = await api.get('/calendar/slots');
    dispatch({
      type:GET_SLOTS_SUCCESS,
      payload:slots.data
    })

  }catch(err){
    console.log(err.response)
    dispatch({
      type:GET_SLOTS_FAIL
    })
  }
}
