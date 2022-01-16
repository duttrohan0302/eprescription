import React, { useState } from "react";
import {useLocation} from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { sendResetPasswordLink } from '../Actions/authActions';
import { setPassword } from '../Actions/authActions';
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import { setAlert } from "../Actions/alertActions";
import store from '../Helpers/store';
import { history } from "../Helpers";


const ResetPassword = ({errors,sendResetPasswordLink,setPassword}) => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: ''
  });
  const [token,setToken] = useState(null);


  const { pathname } = useLocation();

  const tok = pathname.split('/')[pathname.split('/').length-1];

  useEffect(()=>{
    if(tok!=='resetPassword'){
      const decoded = jwt_decode(tok);

      setToken(decoded)
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
  
        store.dispatch(setAlert('The link has expired, please generate a new link','danger',5000))
        setToken(null)
        history.push('/login')
      }
    }
    
  },[pathname])

  const { email,password,password2 } = formData;
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(errors){
      delete errors[e.target.name]
    }
  }

  const onSubmitReset = e => {
    e.preventDefault();
    sendResetPasswordLink(email);
  };
  const onSubmitSetPassword = e => {
    e.preventDefault();
    setPassword(token.id,password,password2);
  };

  const sendReset = (
    <div className="main">
        <section className="sign-in" style={{borderTop:'0.5px solid black'}}>
                <div className="signin-form">
                        <h2 className="form-title" style={{fontFamily:'sans-serif'}}>Reset Password</h2>
                        <form className="login-form" id="login-form" noValidate onSubmit={onSubmitReset}>
                            <div className="form-group">
                                {/* <label htmlFor="email"><i className="fa fa-envelope"></i></label> */}
                                <input
                                  type="email"
                                  placeholder="Your Email"
                                  className={ 
                                    (errors && errors.email) ?
                                    "form-control form-control-lg is-invalid"
                                    : "form-control form-control-lg" 
                                  }
                                  name="email"
                                  value={email}
                                  onChange={onChange}
                                />
                                {
                                  errors && errors.email &&
                                  <small className="text-danger">{errors.email}</small>
                                }
                            </div>
                            <div className="form-group form-button">
                                <input type="submit" name="signin" id="signin" className="form-submit" value="Get Reset Link"/>
                            </div>
                        </form>
                  </div>
        </section>
    </div>

  )
  const resetPass = (
    <div className="main">
        <section className="sign-in" style={{borderTop:'0.5px solid black'}}>
                <div className="signin-form">
                        <h2 className="form-title" style={{fontFamily:'sans-serif'}}>Reset Password</h2>
                        <form className="login-form" id="login-form" noValidate onSubmit={onSubmitSetPassword}>
                            <div className="form-group">
                                <input
                                  type="email"
                                  placeholder="Your Email"
                                  className={ 
                                  "form-control form-control-lg" 
                                  }
                                  name="email"
                                  value={token ? token.email : ''}
                                  disabled
                                />
                            </div>
                            <div className="form-group">
                                <input
                                  type="password"
                                  placeholder="New password"
                                  className={ 
                                    (errors && errors.password) ?
                                    "form-control form-control-lg is-invalid"
                                    : "form-control form-control-lg" 
                                  }
                                  name="password"
                                  value={password}
                                  onChange={onChange}
                                />
                                {
                                  errors && errors.password &&
                                  <small className="text-danger">{errors.password}</small>
                                }
                            </div>
                            <div className="form-group">
                                <input
                                  type="password"
                                  placeholder="Confirm new password"
                                  className={ 
                                    (errors && errors.password2) ?
                                    "form-control form-control-lg is-invalid"
                                    : "form-control form-control-lg" 
                                  }
                                  name="password2"
                                  value={password2}
                                  onChange={onChange}
                                />
                                {
                                  errors && errors.password2 &&
                                  <small className="text-danger">{errors.password2}</small>
                                }
                            </div>

                            <div className="form-group form-button">
                                <input type="submit" name="signin" id="signin" className="form-submit" value="Reset Password"/>
                            </div>
                        </form>
                  </div>
        </section>
    </div>
  )
  return !(token && token.id) ? sendReset : resetPass
}


ResetPassword.propTypes = {
    sendResetPasswordLink: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    errors: PropTypes.object || PropTypes.bool
};
  
const mapStateToProps = state => ({
    errors: state.auth.errors
});
  
  export default connect(mapStateToProps, { sendResetPasswordLink,setPassword })(ResetPassword);