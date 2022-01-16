import React from 'react';
import { Button } from 'reactstrap';
import ImageSRC from '../Images/homepage.jpg';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { history } from '../Helpers';

const HomePage = props => {

    if(props.isAuthenticated){
        history.push('/dashboard')
    }
    return(
        <div className = "row">
            <img src={ImageSRC} alt="Calendar Homepage" width="100%" height="800"/>
            <div className="buttonContainer" style={{
                    position:'absolute',
                    left:'35%',
                    top:'45%',
                }}
            >
                <Link to="/login">
                    <Button color="success" size="lg" style={{marginRight:10,width:250}}>Login</Button>
                </Link>
                <Link to="/register">
                    <Button color="warning" size="lg" style={{marginLeft:10,width:250}}>Patient Sign Up</Button>
                </Link>
            </div>
        </div>
    )
}

HomePage.propTypes = {
    isAuthenticated: PropTypes.bool
};
  
const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
});
  
export default connect(mapStateToProps)(HomePage);
