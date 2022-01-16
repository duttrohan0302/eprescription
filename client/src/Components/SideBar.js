import React from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getReceivedInvitations } from "../Actions/invitationActions";

const SideBarItem = ({name,address,location,data}) => {

    const isActive = address===location ? true : false 
    const itemStyle={
        height:'50px',
        borderBottom:'1px solid whitesmoke',
        paddingLeft:20,
        paddingTop:10,
        backgroundColor: isActive ? '#D3D3D3' : null,
        color: isActive ? 'black' : 'white',
    }
    const circleCount = {
        height:'30px',
        width:'30px',
        borderRadius:'60%',
        backgroundColor: '#9179e0',
        color: isActive ? 'black' : 'yellow',
        textAlign:'center',
        padding:'5px',
        paddingLeft:'10px',
        paddingBottom:'10px',

    }
    return (
        <Link to={address} style={{textDecoration:'none'}}>
            <div className="row" style={itemStyle}>
                {name}
                {
                    data ?
                    <div className="ml-5 row" style={circleCount}>{data}</div>
                    : null
                }
            </div>
        </Link>
    )
}
const SideBar = ({getReceivedInvitations,receivedInvitationsCount,user}) => {
    const { userRole } = user
    console.log(userRole)
    useEffect(()=>{
        getReceivedInvitations();
    },[getReceivedInvitations])

    const sidebarStyles= {
        color:'white',
        backgroundColor:'#343a40',
        borderTop:'1px white solid',
        borderBottom:'1px white solid',
    }
    const location=useLocation().pathname;
    return(
            <div className="col-lg-2 col-md-3 col-sm-12 min-vh-100" style={sidebarStyles}>
                    {
                        userRole==='admin' &&
                        <div className="container-fluid p-0">
                            <SideBarItem name="My Profile" location={location} address="/myProfile"/>
                            <SideBarItem name="Create Doctor Profile" location={location} address="/register-doctor"/>
                            <SideBarItem name="View Feedbacks" location={location} address="/feedbacks"/>
                        </div>
                    }
                    {
                        userRole==='patient' &&
                        <div className="container-fluid p-0">
                            <SideBarItem name="Dashboard" location={location} address="/dashboard" />
                            <SideBarItem name="My Profile" location={location} address="/myProfile"/>
                            <SideBarItem name="View Prescriptions" location={location} address="/prescriptions"/>
                            <SideBarItem name="New Feedback" location={location} address="/new-feedback"/>
                            <SideBarItem name="Received Appointments" location={location} data={receivedInvitationsCount ? receivedInvitationsCount : null} address="/receivedInvitations" />
                            <SideBarItem name="Sent Appointment Requests" location={location} address="/sentInvitations"/>
                            
                        </div>
                    }
                    {
                        userRole==='doctor' &&
                        <div className="container-fluid p-0">
                            <SideBarItem name="Dashboard" location={location} address="/dashboard" />
                            <SideBarItem name="My Profile" location={location} address="/myProfile"/>
                            <SideBarItem name="New Prescription" location={location} address="/create-prescription"/>
                            <SideBarItem name="Received Appointments" location={location} data={receivedInvitationsCount ? receivedInvitationsCount : null} address="/receivedInvitations" />
                            <SideBarItem name="Sent Appointment Requests" location={location} address="/sentInvitations"/>
                        </div>
                    }

            </div>
    )
}


SideBar.propTypes = {
    auth: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
    getReceivedInvitations: PropTypes.func,
    errors: PropTypes.object,
    receivedInvitationsCount: PropTypes.number,
    user: PropTypes.object
};
  
const mapStateToProps = (state) => ({
    auth: state.auth,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.invitation.errors,
    receivedInvitationsCount: state.invitation.receivedInvitationsCount
});
  
export default connect(mapStateToProps,{getReceivedInvitations})(SideBar);