import api from '../Utils/api';
import { setAlert } from './alertActions';

import { 
    GET_RECEIVED_INVITATIONS_SUCCESS,
    GET_RECEIVED_INVITATIONS_FAIL,
    GET_SENT_INVITATIONS_SUCCESS,
    GET_SENT_INVITATIONS_FAIL,
    ACCEPT_INVITATION_SUCCESS,
    ACCEPT_INVITATION_FAIL,
    REJECT_INVITATION_SUCCESS,
    REJECT_INVITATION_FAIL,
    SUGGEST_INVITATION_SUCCESS,
    SUGGEST_INVITATION_FAIL,
    SEND_INVITATION_SUCCESS,
    SEND_INVITATION_FAIL,
    ADD_INVITATION_TO_EVENT,
    DELETE_INVITATION_SUCCESS,
    DELETE_INVITATION_FAIL
 } from "./types";

export const getReceivedInvitations = () => async dispatch => {

    try{
        const res = await api.get('/invitations');

        if(res.data){
            dispatch({
                type:GET_RECEIVED_INVITATIONS_SUCCESS,
                payload:res.data
            })
        }
    }catch(err){
        if(err.response){
            dispatch(setAlert(`Some Error Occurred. ERROR MSG: ${err.response.data}`,'danger',4000))
            dispatch({
                type:GET_RECEIVED_INVITATIONS_FAIL,
                payload:err.response.data
            })
        }
        
    }

}

export const getSentInvitations = () => async dispatch => {

    try{
        const res = await api.get('/invitations/sent');
        if(res.data){
            dispatch({
                type:GET_SENT_INVITATIONS_SUCCESS,
                payload:res.data
            })
        }
    }catch(err){

        if(err.response){
            dispatch(setAlert(`Some Error Occurred. ERROR MSG: ${err.response.data}`,'danger',4000))
            dispatch({
                type:GET_SENT_INVITATIONS_FAIL,
                payload:err.response.data
            })
        }
        
    }

}

export const acceptInvitation = (id) => async dispatch => {

    try{
        const res = await api.patch(`/invitation/accept/${id}`);
        if(res.data){
            

            dispatch(setAlert('Invitation Accepted Successfully, Event Created in your calendar','success',4000))
            dispatch({
                type:ACCEPT_INVITATION_SUCCESS,
                payload:res.data.invitation._id
            })
        }
    }catch(err){
        if(err.response){
            if(err.response.data){
                Object.keys(err.response.data).forEach(function (key){
                    dispatch(setAlert(`Some Error Occurred. ERROR MSG: ${err.response.data[key]}`,'danger',4000))
                });
            }
        }
        dispatch({
            type:ACCEPT_INVITATION_FAIL,
        })
    }

}

export const rejectInvitation = (id,rejectionMessage) => async dispatch => {

    try{
        const body = {
            rejectionMessage
        }
        const res = await api.patch(`/invitation/reject/${id}`,body);
        if(res.data){
            dispatch({
                type:REJECT_INVITATION_SUCCESS,
                payload:res.data._id
            })

            dispatch(setAlert('Invitation Rejected Successfully','success',4000))
        }
    }catch(err){
        if(err.response){
            if(err.response.data){
                Object.keys(err.response.data).forEach(function (key){
                    dispatch(setAlert(`Some Error Occurred. ERROR MSG: ${err.response.data[key]}`,'danger',4000))
                });
            }
        }
        dispatch({
            type:REJECT_INVITATION_FAIL,
        })
    }

}

export const suggestInInvitation = (id,suggestionMessage) => async dispatch => {

    try{

        const res = await api.patch(`/invitation/suggest/${id}`,{suggestionMessage});
        if(res.data){
            dispatch({
                type:SUGGEST_INVITATION_SUCCESS,
                payload:res.data._id
            })

            dispatch(setAlert('Suggestion sent Successfully','success',4000))
        }
    }catch(err){
        if(err.response){
            if(err.response.data){
                Object.keys(err.response.data).forEach(function (key){
                    dispatch(setAlert(`Some Error Occurred. ERROR MSG: ${err.response.data[key]}`,'danger',4000))
                });
            }
        }
        dispatch({
            type:SUGGEST_INVITATION_FAIL,
            payload:err.response.data
        })
    }

}

export const sendInvitation =(eventId,emails) => async dispatch => {
    try{
        console.log("invitation func called")
        const res = await api.post(`/invitation/${eventId}`,{emails});
        dispatch({
            type:SEND_INVITATION_SUCCESS,
        })
        console.log(res)
        const event = res.data.event;
        const invitation = {
            id: res.data._id,
            host: {
                email: res.data.fromUser.email,
                name: res.data.fromUser.name
              },
              attendees: res.data.actedUpon.map(user=>{return{
                name: user.user.name,
                email: user.user.email,
                action: user.action
              }})
        }
        dispatch({
            type:ADD_INVITATION_TO_EVENT,
            payload: {event,invitation}
        })
        dispatch(setAlert('Invitation sent successfully','success',4000))
    } catch(err){
        if(err.response){
            if(err.response.data){
                Object.keys(err.response.data).forEach(function (key){
                    dispatch(setAlert(err.response.data[key],'danger',4000))
                });
                dispatch({
                    type:SEND_INVITATION_FAIL,
                    payload: err.response.data
                })
            }
        }
    }
}

export const deleteInvitation = (id) => async dispatch => {

    try{
        const res = await api.delete(`/invitation/${id}`);
        if(res.data){
            dispatch(setAlert("Invitation deleted Successfully",'success',4000))
            dispatch({
                type:DELETE_INVITATION_SUCCESS,
                payload:id
            })
        }
        
    }catch(err){
        if(err.response){

            if(err.response.data && typeof(err.response.data==='object')){
                Object.keys(err.response.data).forEach(function (key){
                    dispatch(setAlert(err.response.data[key],'danger',4000))
                });
                
            }
            else{
                dispatch(setAlert(err.response.data,'danger',4000))
            }
            dispatch({
                type:DELETE_INVITATION_FAIL,
                payload: err.response.data
            })
        }
    }
}


