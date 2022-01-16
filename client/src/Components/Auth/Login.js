import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../Actions/authActions';
// import LoginImageSRC from '../../Images/signin.jpg';
import LoginImageSRC from '../../Images/doctorPatientSignIn.jpg';

import './../../Auth.css';

const Login = ({ login, isAuthenticated, errors }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(errors){
      delete errors[e.target.name]
    }
  }

  const onSubmit = e => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="main">

        <section className="sign-in" style={{borderTop:'0.5px solid black'}}>
            <div className="container" style={{marginTop:'20px'}}>
                <div className="signin-content">
                    <div className="signin-image" >
                        <figure><img src={LoginImageSRC} alt="Sign in" height={250}/></figure>
                        Don't have an account,&nbsp;<br /><Link to="/register">Sign Up as a Patient</Link>
                    </div>

                    <div className="signin-form">
                        <h2 className="form-title" style={{fontFamily:'sans-serif'}}>Log In</h2>
                        <form className="login-form" id="login-form" noValidate onSubmit={onSubmit}>
                            <div className="form-group">
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
                              
                            <div className="form-group">
                                <input
                                  type="password"
                                  placeholder="Password"
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
                                <p></p>
                                <small><Link to="/resetPassword">Forgot Password</Link></small>
                            </div>
                            
                            <div className="form-group form-button">
                                <input type="submit" name="signin" id="signin" className="form-submit" value="Log in"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>

    </div>

  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  errors: PropTypes.object || PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  errors: state.auth.errors
});

export default connect(mapStateToProps, { login })(Login);