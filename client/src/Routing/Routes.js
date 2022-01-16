import React from 'react';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import Register from '../Components/Auth/Register';
import Login from '../Components/Auth/Login';

import PrivateRoute from './PrivateRoute';
import DefaultLayoutRoute from './DefaultLayout';
import DashBoard from '../Components/DashBoard';
import NotFound from '../Components/NotFound';
import MyProfile from '../Components/MyProfile';
import FriendCalendar from '../Components/FriendCalendar';
import ResetPassword from '../Components/ResetPassword';
import ChangePassword from '../Components/ChangePassword';
import ReceivedInvitations from '../Components/ReceivedInvitations';
import SentInvitations from '../Components/SentInvitations';
import RegisterDoctor from '../Components/Auth/RegisterDoctor';
import ViewFeedbacks from '../Components/ViewFeedbacks';
import NewPrescription from '../Components/NewPrescription';
import NewFeedback from '../Components/NewFeedback';
import ViewPrescription from '../Components/ViewPrescription';
import Prescriptions from '../Components/Prescriptions';
import VideoConference from '../Components/Video';


const Routes =  ({isAuthenticated})  => {
  return (
      <Switch>
        <DefaultLayoutRoute exact path="/register" component={Register} />
        <DefaultLayoutRoute exact path="/login" component={Login} />
        <DefaultLayoutRoute path="/resetPassword" component={ResetPassword} />
        <PrivateRoute exact path="/changePassword" component={ChangePassword} />
        <PrivateRoute exact path="/dashboard" component={DashBoard} />
        <PrivateRoute exact path="/myProfile" component={MyProfile} />
        <PrivateRoute exact path="/receivedInvitations" component={ReceivedInvitations} />
        <PrivateRoute exact path="/sentInvitations" component={SentInvitations} />
        <PrivateRoute exact path="/register-doctor" component={RegisterDoctor} />
        <PrivateRoute exact path="/feedbacks" component={ViewFeedbacks} />
        <PrivateRoute exact path="/new-feedback" component={NewFeedback} />
        <PrivateRoute exact path="/create-prescription" component={NewPrescription} />
        {/* <PrivateRoute exact path="/prescriptions" component={ViewPrescription} /> */}
        <PrivateRoute exact path="/prescriptions" component={Prescriptions} />
        <DefaultLayoutRoute exact path="/video" component={VideoConference} />

        {
          isAuthenticated ? 
          <PrivateRoute exact path="/calendar/:slug" component={FriendCalendar} />
          :
          <DefaultLayoutRoute exact path="/calendar/:slug" component={FriendCalendar} />

        }
        {
          isAuthenticated ?
          
          <PrivateRoute component={NotFound} />
          :
          <DefaultLayoutRoute component={NotFound} />

        }
      </Switch>
  );
};


const mapStateToProps = (state) => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Routes);
