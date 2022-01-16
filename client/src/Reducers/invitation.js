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
    DELETE_INVITATION_SUCCESS
} from '../Actions/types';

const initialState = {
    loading: true,
    invitations: null,
    errors: null,
    receivedInvitationsCount: 0
  };
  

 
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_RECEIVED_INVITATIONS_SUCCESS:
            return{
                ...state,
                loading: false,
                invitations: payload,
                receivedInvitationsCount: payload.length,
                errors: null
            };
        case GET_SENT_INVITATIONS_SUCCESS:
            return{
                ...state,
                loading: false,
                invitations: payload,
                errors: null
            };
        case GET_RECEIVED_INVITATIONS_FAIL:
        case GET_SENT_INVITATIONS_FAIL:
            return{
                ...state,
                loading: false,
                invitations: null,
                errors: payload
            }
        case ACCEPT_INVITATION_SUCCESS:
        case REJECT_INVITATION_SUCCESS:
        case SUGGEST_INVITATION_SUCCESS:
            return {
                ...state,
                loading: false,
                invitations: state.invitations.filter(invitation=> invitation._id!==payload),
                receivedInvitationsCount: state.invitations.receivedInvitationsCount-1
            }
        case SEND_INVITATION_SUCCESS:
            return{
                ...state,
                loading: false,
                errors:null
            };
        case SEND_INVITATION_FAIL:
            return{
                ...state,
                loading: false,
                errors: payload
            };
            // Rest all cases are default
        case ACCEPT_INVITATION_FAIL:
        case REJECT_INVITATION_FAIL:
        case SUGGEST_INVITATION_FAIL:
        case DELETE_INVITATION_SUCCESS:
        default:
            return state;
    }
  }