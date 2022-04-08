import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { isLoggedIn } from "./common/api/auth";
import Header from "./components/header";
import { getAuthenticatedUser } from "./redux/actions/userActions";
import { getUser } from "./redux/selectors/userSelectors";
import store from "./redux/store";
import AppRoutes from "./routes";
import BaseStyles, { theme } from "./styles";

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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <BaseStyles />
        <App />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </ThemeProvider>
    </BrowserRouter>
  </ReduxProvider>
);