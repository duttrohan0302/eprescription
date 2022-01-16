import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { changePassword } from '../Actions/authActions';


const ChangePassword = ({user,errors,changePassword}) => {

  const [formData, setFormData] = useState({
    email: user.email,
    oldpassword:'',
    password: '',
    password2: ''
  });


  const { email,oldpassword,password,password2 } = formData;
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(errors){
      delete errors[e.target.name]
    }
  }

  const onSubmit = e => {
    e.preventDefault();
    const { id } = user;
    changePassword(id,oldpassword,password,password2);
  };


  return (
    <div className="main">
        <section className="sign-in">
            <div className="signin-form">
                    <h2 className="form-title" style={{fontFamily:'sans-serif'}}>Change Password</h2>
                    <form className="login-form" id="login-form" noValidate onSubmit={onSubmit}>
                        <div className="form-group" >
                            <label for="email" style={{fontSize:'20px'}}>Email</label>
                            <input
                              type="email"
                              placeholder="Your Email"
                              className={ 
                              "form-control form-control-lg" 
                              }
                              name="email"
                              value={email}
                              disabled
                            />
                        </div>
                        <div className="form-group" style={{marginTop:'-15px'}}>
                            <label for="oldpassword" className={oldpassword==='' ? 'invisible' : 'visible'} style={{fontSize:'20px'}}>Current Password</label>

                            {/* {oldpassword==='' ? null : <label for="currentpassword">Current Password</label>} */}
                            <input
                              type="password"
                              placeholder="Current password"
                              className={ 
                                (errors && errors.oldpassword) ?
                                "form-control form-control-lg is-invalid"
                                : "form-control form-control-lg" 
                              }
                              name="oldpassword"
                              value={oldpassword}
                              onChange={onChange}
                            />
                            {
                              errors && errors.oldpassword &&
                              <small className="text-danger">{errors.oldpassword}</small>
                            }
                        </div>
                        
                        <div className="form-group" style={{marginTop:'-15px'}}>
                            <label for="newpassword" className={password==='' ? 'invisible' : 'visible'} style={{fontSize:'20px'}}>New Password</label>
                            {/* {password==='' ? null : <label for="newpassword">New Password</label>} */}
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
                        <div className="form-group" style={{marginTop:'-15px'}}>
                            <label for="newpassword2" className={password2==='' ? 'invisible' : 'visible'} style={{fontSize:'20px'}}>Confirm new Password</label>

                            {/* {password2==='' ? null : <label for="newpassword2">Confirm new Password</label>} */}
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
                            <input type="submit" name="signin" id="signin" className="form-submit" value="Change Password"/>
                        </div>
                    </form>
              </div>
        </section>
    </div>
  )
}


ChangePassword.propTypes = {
    changePassword: PropTypes.func.isRequired,
    errors: PropTypes.object || PropTypes.bool,
    user: PropTypes.object
};
  
const mapStateToProps = state => ({
    errors: state.auth.errors,
    user: state.auth.user
});
  
  export default connect(mapStateToProps, { changePassword })(ChangePassword);