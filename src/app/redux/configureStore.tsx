import {applyMiddleware, createStore, Store} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";

const configureStore = (initialState?: any): Store => {
  const isProduction = process.env.NODE_ENV === "production";

  return createStore(
    rootReducer,
    initialState,
    isProduction
      ? applyMiddleware(thunk)
      : composeWithDevTools(
          applyMiddleware(thunk, reduxImmutableStateInvariant())
        )
  );
};

export default configureStore;
