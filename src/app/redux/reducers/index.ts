import { combineReducers } from "redux";
import apiCallStatusReducer from "./apiStatusReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  apiCallStatusReducer,
  userReducer
});

export default rootReducer;
