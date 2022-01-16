import React from 'react';
import { Router,Route, Switch } from 'react-router-dom';
import { history } from './Helpers';

import './App.css';

import { Provider } from 'react-redux';
import store from './Helpers/store';
import jwt_decode from 'jwt-decode';

import HomePage from './Components/HomePage';
import setAuthToken from './Utils/setAuthToken';
import { loadUser,logout } from './Actions/authActions';
import Routes from './Routing/Routes';

import DefaultLayoutRoute from './Routing/DefaultLayout';

// Check for token

if (localStorage.token) {
    // Set auth token header auth
    setAuthToken(localStorage.token);
    // Decode token and get user info and expiration
    const decoded = jwt_decode(localStorage.token);
    console.log(decoded)
    // Set User and isAuthenticated
    store.dispatch(loadUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logout());

      // Redirect to home
      window.location.href = "/";
    }
}

const App = () => {
  

  return (
    <Provider store={store}>
        <Router history={history}>
            <Switch>
              <DefaultLayoutRoute exact path='/' component = {HomePage} />
              <Route component = {Routes} />
            </Switch>
        </Router>
    </Provider>
    
    
  );
}

export default App;
