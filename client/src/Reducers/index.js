import { combineReducers} from 'redux';

// Import all the reducers here
import auth from './auth';
import alert from './alert';
import event from './event';
import invitation from './invitation';


const rootReducer = combineReducers({
    auth,
    alert,
    event,
    invitation
});

export default rootReducer;