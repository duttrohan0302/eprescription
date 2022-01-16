import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../Actions/alertActions';
import { register } from '../../Actions/authActions';
import PropTypes from 'prop-types';

import RegisterImageSRC from '../../Images/doctor.jpg';

import './../../Auth.css';
const RegisterDoctor = ({ setAlert, register, isAuthenticated,errors }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone:'',
    password: '',
    password2: '',
    age: '',
    sex: '',
    specialization:'',
    userRole:'doctor'
  });

  const { name, email, phone, password, password2, age, sex, specialization } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if(errors){
      delete errors[e.target.name]
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register(formData);
    }
  };

//   if (isAuthenticated) {
//     return <Redirect to="/dashboard" />;
//   }

  return (
    <div className="main">
    <h3 className="form-title" style={{fontFamily:'sans-serif'}}>Register a new doctor</h3>
      <section className="signup" style={{borderTop:'0.5px solid black'}}>
        <div className="container" style={{marginTop:'20px'}}>
            <div className="signup-content">
                <div className="signup-form" >
                    <form id="register-form" className="register-form" noValidate onSubmit={onSubmit}>
                        <div className="form-group">
                            {/* <label htmlFor="name"><i className="fa fa-user" aria-hidden="true"></i></label> */}
                            <input
                              type="text"
                              placeholder="Doctor's Name"
                              className={ 
                                (errors && errors.name) ?
                                "form-control form-control-lg is-invalid"
                                : "form-control form-control-lg" 
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
                            {/* <label htmlFor="email"><i className="fa fa-envelope"></i></label> */}
                            <input
                              type="email"
                              placeholder="Doctor's Email"
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
                            {/* <label htmlFor="phone"><i className="fa fa-phone" aria-hidden="true"></i></label> */}
                            <input
                              type="number"
                              placeholder="Doctor's Phone Number"
                              className={ 
                                (errors && errors.phone) ?
                                "form-control form-control-lg is-invalid"
                                : "form-control form-control-lg" 
                              }
                              name="phone"
                              value={phone}
                              onChange={onChange}
                            />
                            {
                              errors && errors.phone &&
                              <small className="text-danger">{errors.phone}</small>
                            }
                        </div>
                        <div className="form-group">
                            {/* <label htmlFor="pass"><i className="fa fa-lock"></i></label> */}
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
                        </div>
                        <div className="form-group">
                            <input
                              type="password"
                              placeholder="Confirm Password"
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
                        <div className="form-group">
                            <input
                              type="number"
                              placeholder="Doctor's Age"
                              className={ 
                                (errors && errors.age) ?
                                "form-control form-control-lg is-invalid"
                                : "form-control form-control-lg" 
                              }
                              name="age"
                              value={age}
                              onChange={onChange}
                            />
                            {
                              errors && errors.age &&
                              <small className="text-danger">{errors.age}</small>
                            }
                        </div>
                        <div className="form-group">
                            <input
                              type="text"
                              placeholder="Doctor's Sex (M, F or O)"
                              className={ 
                                (errors && errors.sex) ?
                                "form-control form-control-lg is-invalid"
                                : "form-control form-control-lg" 
                              }
                              name="sex"
                              value={sex}
                              onChange={onChange}
                            />
                            {
                              errors && errors.sex &&
                              <small className="text-danger">{errors.sex}</small>
                            }
                        </div>
                        <div className="form-group">
                            <input
                              type="text"
                              placeholder="Doctor's Specialization"
                              className={ 
                                (errors && errors.specialization) ?
                                "form-control form-control-lg is-invalid"
                                : "form-control form-control-lg" 
                              }
                              name="specialization"
                              value={specialization}
                              onChange={onChange}
                            />
                            {
                              errors && errors.specialization &&
                              <small className="text-danger">{errors.specialization}</small>
                            }
                        </div>
                        <div className="form-group form-button">
                            <input type="submit" name="signup" id="signup" className="form-submit" value="Register"/>
                        </div>
                    </form>
                </div>
                <div className="signup-image">
                    <figure><img src={RegisterImageSRC} alt="Sign up" height={500}/></figure>
                    {/* <Link to="/login">I already have an account</Link> */}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

RegisterDoctor.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  errors: PropTypes.object || PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  errors: state.auth.errors
});

export default connect(mapStateToProps, { setAlert, register })(RegisterDoctor);