import api from '../Utils/api';
import { setAlert } from './alertActions';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  CLEAR_EVENT_PROFILE,
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
  SAVE_PRESCRIPTION_SUCCESS,
  SAVE_PRESCRIPTION_FAIL,
  GET_PRESCRIPTIONS_SUCCESS,
  GET_PRESCRIPTIONS_FAIL
} from './types';

import setAuthToken from "../Utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { history } from '../Helpers';

// Load User
export const loadUser = (decoded) => async dispatch => {
  try {
    dispatch({
      type: USER_LOADED,
      payload: decoded
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = formData => async dispatch => {
  try {
    const res = await api.post('/register', formData);

    console.log(res.data)
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(setAlert('Registration successful!','success',4000));
    // if(res.data.userRole==='patient'){
    //   history.push('/login')
    // }

  } catch (err) {
    
    if(err.response){
      const errors = err.response.data;

      dispatch({
        type: REGISTER_FAIL,
        payload: errors
      });
    }
  }
};

// Login User- Get user token
export const login = (email, password) => async dispatch => {
  const body = { email, password };

  try {
    const res = await api.post('/login', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    console.log(res.data)
    const { token,user } = res.data;

    // Set token to local storage
    localStorage.setItem("token", token);
    
    // Set token to auth header
    setAuthToken(token);

    const decoded = jwt_decode(token);
    console.log(user)
    dispatch(setAlert(`Login Successful, Welcome ${decoded.name}!`,'success',4000));

    // if(user.userRole==='admin')
    //   history.push('/myProfile')
    dispatch(loadUser(user));

  } catch (err) {
    if(err.response){
      const errors = err.response.data;

      dispatch({
        type: LOGIN_FAIL,
        payload: errors
      });
    }
  }
};

// Logout
export const logout = () => (dispatch) => {

    // Remove token from localStorage
    localStorage.removeItem("token");
    //   // Remove auth header for future requests
    setAuthToken(false);
    dispatch({
        type:LOGOUT
    })
    dispatch({
      type:CLEAR_EVENT_PROFILE
    })
}


// Delete Account permanently
export const deleteAccount = () => async dispatch => {
  try{
    const res = await api.delete('/users');

    if(res){
      history.push('/');
      dispatch({
        type: ACCOUNT_DELETED
      })
      dispatch(setAlert('Account Deleted Succesfully','success',4000));

    }
  }catch(errors){
    if(errors.response){
      dispatch(setAlert(errors.response.data,'danger'))
    }
  }
}

export const sendResetPasswordLink = (email) => async dispatch => {

  try{
    const res = await api.post('/user/resetPassword',{email: email})

    if(res){
      dispatch(setAlert('Reset Password mail sent. Please check your mail for further instructions','success',4000))
      history.push('/login')
    }
  }
  catch(err){
    if(err.response){
      dispatch({
        type: RESET_PASSWORD_MAIL_FAIL,
        payload: err.response.data.errors
      });
    }
  }
}

export const setPassword = (id,password,password2) => async dispatch => {
  try{
    const res = await api.patch('/user/setPassword',{id,password,password2})
    if(res){
      dispatch(setAlert('The password has been changed, please login','success',4000))
      history.push('/login')
    }

  }catch(err){
    if(err.response){
      dispatch({
        type: RESET_PASSWORD_SET_PASSWORD_FAIL,
        payload: err.response.data
      });
    }
  }
}

export const changePassword = (id,oldpassword,password,password2) => async dispatch => {
  try{
    const res = await api.patch('/user/changePassword',{id,oldpassword,password,password2})
    if(res){
      dispatch(setAlert('The password has been changed','success',4000))
      history.push('/')
    }

  }catch(err){
    if(err.response){
      dispatch({
        type: CHANGE_PASSWORD_FAIL,
        payload: err.response.data
      });
    }
  }
}

export const getAllDoctors = () => async dispatch => {
  try{
    const res = await api.get('/users/role/doctor');
    console.log(res.data)

    dispatch({
      type:GET_DOCTORS_SUCCESS,
      payload: res.data
    })
  }catch(err){
    if(err.response){
      console.log(err.response)
      dispatch({
        type: GET_DOCTORS_FAIL,
        payload: err.response.data
      });

      dispatch(setAlert(err.response.data,'danger',4000))
    }
  }

}

export const getDoctorFeedback = (id) => async dispatch => {
  try{
    const res = await api.get(`feedbacks/${id}`);
    console.log(res.data)

    dispatch({
      type:GET_DOCTOR_FEEDBACK_SUCCESS,
      payload: res.data
    })
  }catch(err){
    if(err.response){
      console.log(err.response)
      dispatch({
        type: GET_DOCTOR_FEEDBACK_FAIL,
        payload: err.response.data
      });

      dispatch(setAlert(err.response.data,'danger',4000))
    }
  }

}

export const getAllPatients = () => async dispatch => {
  try{
    const res = await api.get('/users/role/patient');
    console.log(res.data)

    dispatch({
      type:GET_PATIENTS_SUCCESS,
      payload: res.data
    })
  }catch(err){
    if(err.response){
      console.log(err.response)
      dispatch({
        type: GET_PATIENTS_FAIL,
        payload: err.response.data
      });

      dispatch(setAlert(err.response.data,'danger',4000))
    }
  }

}

export const getMyDoctors = () => async dispatch => {
  try{
    const res = await api.get('/getMyDoctors');
    console.log(res.data)

    dispatch({
      type:GET_MY_DOCTORS_SUCCESS,
      payload: res.data
    })
  }catch(err){
    if(err.response){
      console.log(err.response)
      dispatch({
        type: GET_MY_DOCTORS_FAIL,
        payload: err.response.data
      });

      dispatch(setAlert(err.response.data,'danger',4000))
    }
  }

}

export const submitFeedback = (data) => async dispatch => {
  try{
    const res = await api.post('/feedback',data);
    console.log(res.data)

    dispatch({
      type:SUBMIT_FEEDBACK_SUCCESS,
      payload: res.data
    })
    dispatch(setAlert("Feedback submitted successfully",'success',4000))
    history.push('/dashboard')
  }catch(err){
    if(err.response){
      console.log(err.response)
      dispatch({
        type: SUBMIT_FEEDBACK_FAIL,
        payload: err.response.data
      });

      dispatch(setAlert(err.response.data,'danger',4000))
    }
  }

}

export const savePrescription = (data) => async dispatch => {
  try{
    const res = await api.post('/prescription',data);
    console.log(res.data)

    dispatch({
      type:SAVE_PRESCRIPTION_SUCCESS,
    })
    dispatch(setAlert("Prescription Saved Successfully",'success',4000))
  }catch(err){
    if(err.response){
      console.log(err.response)
      dispatch({
        type: SAVE_PRESCRIPTION_FAIL,
        payload: err.response.data
      });

      // dispatch(setAlert(err.response.data,'danger',4000))
    }
  }

}

export const getPrescriptions = (patientId) => async dispatch => {
  try{
    const res = await api.get(`/prescriptions/${patientId}`);
    console.log(res.data)

    dispatch({
      type:GET_PRESCRIPTIONS_SUCCESS,
      payload:res.data
    })
  }catch(err){
    if(err.response){
      console.log(err.response)
      dispatch({
        type: GET_PRESCRIPTIONS_FAIL,
        payload: err.response.data
      });

      dispatch(setAlert(err.response.data,'danger',4000))
    }
  }

}