import { combineReducers } from "redux";
import apiStatusReducer from "./apiStatusReducer";
import authenticateReducer from "./authReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  apiCallsInProgress: apiStatusReducer,
  auth: authenticateReducer,
  user: userReducer
});

export default rootReducer;