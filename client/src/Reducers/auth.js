import {
  REGISTER_SUCCESS,
  //REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  ACCOUNT_DELETED,
  LOGIN_FAIL,
  REGISTER_FAIL,
  RESET_PASSWORD_MAIL_FAIL,
  RESET_PASSWORD_SET_PASSWORD_FAIL,
  CHANGE_PASSWORD_FAIL,
  GET_DOCTORS_SUCCESS,
  GET_DOCTORS_FAIL,
  GET_DOCTOR_FEEDBACK_SUCCESS,
  GET_DOCTOR_FEEDBACK_FAIL,
  GET_PATIENTS_SUCCESS,
  GET_PATIENTS_FAIL,
  GET_MY_DOCTORS_SUCCESS,
  GET_MY_DOCTORS_FAIL,
  SUBMIT_FEEDBACK_SUCCESS,
  SUBMIT_FEEDBACK_FAIL,
  GET_PRESCRIPTIONS_SUCCESS,
  GET_PRESCRIPTIONS_FAIL
} from '../Actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: false,
  user: null,
  errors: null,
  doctors:null,
  patients:null,
  doctorsFeedback:null,
  prescriptions:null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        errors: payload
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case LOGIN_FAIL:
      return{
        ...state,
        errors: payload,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case ACCOUNT_DELETED:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case AUTH_ERROR:
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case RESET_PASSWORD_MAIL_FAIL:
    case RESET_PASSWORD_SET_PASSWORD_FAIL:
    case CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        errors:payload,
        loading: false
      }
    case GET_DOCTORS_SUCCESS:
      return{
        ...state,
        doctors:payload,
        loading:false
      }
    case GET_DOCTORS_FAIL:
      return{
        ...state,
        errors: payload,
        loading:false
      }
    case GET_PATIENTS_SUCCESS:
        return{
          ...state,
          patients:payload,
          loading:false
        }
    case GET_PATIENTS_FAIL:
        return{
          ...state,
          errors: payload,
          loading:false
        }
    case GET_DOCTOR_FEEDBACK_SUCCESS:
      return{
        ...state,
        doctorsFeedback: payload,
        loading:false
      }
    case GET_DOCTOR_FEEDBACK_FAIL:
      return{
        ...state,
        errors: payload,
        loading:false
      }
    case GET_MY_DOCTORS_SUCCESS:
      return{
        ...state,
        doctors:payload,
        loading:false
      }
    case GET_MY_DOCTORS_FAIL:
      return{
        ...state,
        errors: payload,
        loading:false
      }
    case GET_PRESCRIPTIONS_SUCCESS:
      return{
        ...state,
        prescriptions:payload,
        loading: false
      }
    case GET_PRESCRIPTIONS_FAIL:
      return{
        ...state,
        errors:payload,
        loading: false
      }
    default:
      return state;
  }
}