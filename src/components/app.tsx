import Header from "./header/header";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/selectors/userSelectors";
import AppRoutes from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { getAuthenticatedUser } from "../redux/actions/userActions";
import { isLoggedIn } from "../common/api/auth";

const App = () => {
  const user = useSelector((state) => getUser(state));
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn && !user) {
      dispatch(getAuthenticatedUser());
    }
  }, [user]);

  return (
    <>
      <Header />
      <AppRoutes />
    </>
  );
};

export default App;