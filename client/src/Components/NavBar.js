import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  Button,
  NavbarToggler,
  NavbarBrand,
  NavbarText,
  Form,
  FormGroup,
  Input
} from 'reactstrap';

import PropTypes from 'prop-types';
import { logout } from '../Actions/authActions';
import { getCalendarBySlug } from '../Actions/eventActions';

import { connect } from 'react-redux';


const NavBar = ({user, logout,getCalendarBySlug}) => {
  
  const [isOpen, setIsOpen] = useState(false);

  const [calSlug,setCalSlug] = useState('');
  const toggle = () => setIsOpen(!isOpen);
  const onChange = e => {
    setCalSlug(e.target.value)
  }
  const onSubmit = e => {
    e.preventDefault();
    getCalendarBySlug(calSlug,user.id)
  }
  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">E-Prescription</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Form inline className="ml-auto">
            <FormGroup className="mr-5">
              <Input 
                type="text" 
                name="calSlug" 
                id="cal-slug" 
                placeholder="Enter Calendar slug" 
                value={calSlug} 
                onChange={onChange}
                className="mr-2"/>
              <Button color="info" className="mt-auto" onClick={onSubmit}>Search</Button>
            </FormGroup>
          </Form>
          <NavbarText>
            <Button onClick={logout} color="danger">
            <i className="fa fa-sign-out" aria-hidden="true"></i>
              Logout
            </Button>
          </NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

NavBar.propTypes = {
  logout: PropTypes.func.isRequired,
  getCalendarBySlug: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.auth.user
});

export default connect(mapStateToProps,{ logout,getCalendarBySlug })(NavBar);