import { combineReducers } from "redux";
import apiCallStatusReducer from "./apiStatusReducer";

const rootReducer = combineReducers({
  apiCallStatusReducer
});

export default rootReducer;
