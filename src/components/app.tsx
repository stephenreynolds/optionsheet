import Header from "./header/header";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIsLoggedIn, getUser } from "../redux/selectors/userSelectors";
import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { getAuthenticatedUser } from "../redux/actions/userActions";

const App = () => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const user = useSelector((state) => getUser(state));
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn && !user.username) {
      dispatch(getAuthenticatedUser());
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