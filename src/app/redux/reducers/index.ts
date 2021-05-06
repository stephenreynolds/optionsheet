import { combineReducers } from "redux";
import authenticateReducer from "./authReducer";
import projectReducer from "./projectReducer";

const rootReducer = combineReducers({
  authenticateReducer,
  projectReducer
});

export default rootReducer;
