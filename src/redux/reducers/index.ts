import { combineReducers } from "redux";
import apiStatusReducer from "./apiStatusReducer";
import authenticateReducer from "./authReducer";
import projectReducer from "./projectReducer";
import tradeReducer from "./tradeReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  apiCallsInProgress: apiStatusReducer,
  projects: projectReducer,
  trades: tradeReducer,
  user: userReducer,
  auth: authenticateReducer
});

export default rootReducer;