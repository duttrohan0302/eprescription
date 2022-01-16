import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import { login } from '../Actions/authActions';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';



const DefaultNavbar = ({login, isAuthenticated,errors}) => {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);


  const [adminModal, setAdminModal] = useState(false);
  const toggleAdminModal = () => setAdminModal(!adminModal);

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
    <div>
      <div>
        <Modal isOpen={adminModal} toggle={toggleAdminModal} style={{Width:"500"}}>
          <ModalHeader toggle={toggleAdminModal}>Admin Login</ModalHeader>
          <ModalBody>
              <div className="signin-form" style={{padding:0,marginLeft:0}}>
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
          </ModalBody>
        </Modal>
      </div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">E-Prescription</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/register">Register</NavLink>
            </NavItem>
          </Nav>
          <Button color="info" onClick={toggleAdminModal}> Login as Admin</Button>
        </Collapse>
      </Navbar>
    </div>
  );
}

DefaultNavbar.propTypes = {
  auth: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  errors: PropTypes.object || PropTypes.bool
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.auth.errors

});

export default connect(mapStateToProps,{login})(DefaultNavbar);
