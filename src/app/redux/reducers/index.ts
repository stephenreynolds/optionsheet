import { combineReducers } from "redux";
import authenticateReducer from "./authReducer";

const rootReducer = combineReducers({
  authenticateReducer
});

export default rootReducer;
