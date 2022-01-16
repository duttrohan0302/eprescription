import {
    GET_SELF_CAL_SUCCESS,
    GET_SELF_CAL_FAIL,
    CREATE_EVENT_SUCCESS,
    CREATE_EVENT_FAIL,
    CREATE_CAL_SUCCESS,
    CREATE_CAL_FAIL,
    CLEAR_EVENT_PROFILE,
    DELETE_EVENT_SUCCESS,
    GET_OTHERS_CAL_SUCCESS,
    GET_OTHERS_CAL_FAIL,
    CAL_LOADING,
    CAL_LOADING_STOP,
    ADD_INVITATION_TO_EVENT,
    UPDATE_EVENT_SUCCESS,
    UPDATE_EVENT_FAIL,
    DELETE_INVITATION_SUCCESS,
    GET_SLOTS_SUCCESS,
    GET_SLOTS_FAIL,
    SET_SLOTS_SUCCESS,
    SET_SLOTS_FAIL
  } from '../Actions/types';
  
  const initialState = {
    loading: false,
    events: null,
    errors: null,
    newEvent:null,
    slug:null,
    friendCalendar: null,
    friendEvents: null,
    friendSlots: null,
    slots:null
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case CAL_LOADING:
        return {
          ...state,
          loading: true
        };
      case CAL_LOADING_STOP:
        return {
          ...state,
          loading: false
      };
      case CREATE_CAL_SUCCESS:
        return{
          ...state,
          loading: false,
          events:null,
          slug:payload.slug
        };
      case CREATE_CAL_FAIL:
        return{
          ...state,
          loading: false,
          events:null,
          errors:payload
        };
      case GET_SELF_CAL_SUCCESS:
        return {
          ...state,
          loading: false,
          events: payload.eventArray,
          slug: payload.slug,
          slots: payload.slots
        };
      case GET_SELF_CAL_FAIL:
        return {
          ...state,
          loading: false,
          events:null,
          errors:payload
        };
      case GET_OTHERS_CAL_SUCCESS:
        return {
          ...state,
          loading: false,
          friendEvents: payload.events,
          friendCalendar: payload.calendar,
          friendSlots: payload.slots,
          errors:null
        };
        case GET_OTHERS_CAL_FAIL:
          return {
          ...state,
          loading: false,
          events:null,
          errors:payload,
          friendCalendar: null
        };
      case CREATE_EVENT_SUCCESS:
        return {
          ...state,
          events: [...state.events,...payload],
          loading: false,
          newEvent:payload
        };
      case CREATE_EVENT_FAIL:
          return {
            ...state,
            errors:payload,
            loading: false,
            newEvent:null
          };
      case DELETE_EVENT_SUCCESS:
        return{
          ...state,
          loading: false,
          events:state.events.filter(event=> payload.dateId ? event.dateId!==payload.dateId : event.id!==payload.id)
        };
      case ADD_INVITATION_TO_EVENT:
        return{
          ...state,
          loading: false,
          events: state.events.map((event=>{
            if(event.id===payload.event){
              event.invitation = payload.invitation;
              return event;
            }
            return event;
          }))
        };
      case UPDATE_EVENT_SUCCESS:
        return {
          ...state,
          events: state.events.map((event)=>{
            if(event.id===payload.event._id){
              event.title=payload.event.name;
              event.description = payload.event.description;
              if(payload.dateId && event.dateId===payload.dateId){
                const dates = payload.event.dates.filter(date=>date._id===payload.dateId)[0]
                console.log(dates)
                event.start = dates.startTime;
                event.end = dates.endTime;
              }
            return event

            }
            return event
          })
        }
      case DELETE_INVITATION_SUCCESS:
        return{
          ...state,
          events: state.events.map((event)=>{
            console.log(payload)
            if(event.invitation){
              if(event.invitation.id===payload){
                console.log("here",event.invitation.id)
                event.invitation=null;
                return event;
              }
            }
            return event
          })
        }
      case UPDATE_EVENT_FAIL:
        return {
          ...state,
          errors:payload
        }
      case SET_SLOTS_SUCCESS:
      case GET_SLOTS_SUCCESS:
        return{
          ...state,
          slots:payload
        }
      case SET_SLOTS_FAIL:
        return{
          ...state,
          errors:payload
        }
      case CLEAR_EVENT_PROFILE:
        return{
          ...state,...initialState,loading: false,slug:null
        };
      
      default:
        return state;
    }
  }