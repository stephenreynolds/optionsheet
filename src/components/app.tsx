import { getIsLoggedIn } from "../redux/selectors/authSelectors";
import Header from "./header/header";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/selectors/userSelectors";
import * as userActions from "../redux/actions/userActions";
import _ from "lodash";
import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { PromiseDispatch } from "../redux/promiseDispatch";

const App = () => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const user = useSelector((state) => getUser(state));
  const dispatch: PromiseDispatch= useDispatch();

  useEffect(() => {
    if (isLoggedIn && _.isEmpty(user)) {
      dispatch(userActions.getAuthenticatedUser()).then();
    }
  }, [dispatch, isLoggedIn, user]);

  return (
    <>
      <Header />
      <AppRoutes />
    </>
  );
};

export default App;