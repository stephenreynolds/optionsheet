import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const configureStore = (initialState?: any) => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
};

export default configureStore;