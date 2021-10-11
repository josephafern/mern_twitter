import { combineReducers } from 'redux';
import session from './session_reducer';
import errors from './errors_reducer';
import TweetsReducer from './tweets_reducer';

const RootReducer = combineReducers({
    errors,
    session,
    tweets: TweetsReducer
});

export default RootReducer;