import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import * as yup from "yup";
import { login } from "../../common/api/auth";
import { Credentials } from "../../common/models/user";
import { getAuthenticatedUser, logout } from "../../redux/actions/userActions";
import { getIsLoggedIn } from "../../redux/selectors/userSelectors";
import { InputGroup, LoginContainer } from "./style";

const initialValues: Credentials = {
  username: "",
  password: ""
};

const validationScheme = yup.object({
  username: yup.string().required("Username is required."),
  password: yup.string().required("Password is required.")
});

const Login = () => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [loginError, setLoginError] = useState("");

  if (isLoggedIn) {
    return <Navigate to={state ? state : "/"} />;
  }

  const handleSubmit = (credentials: Credentials) => {
    login(credentials)
      .then(() => {
        dispatch(getAuthenticatedUser());
      })
      .catch((error) => {
        dispatch(logout());
        setLoginError(error.message);
      });
  };

  return (
    <LoginContainer className="mt-1">
      <h1 className="text-center">Sign in</h1>

      {loginError.length > 0 && (
        <div className="login-error">
          <FontAwesomeIcon icon={faCircleExclamation} className="error-icon" />
          {loginError}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationScheme}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ getFieldProps, handleSubmit, touched, errors }) => (
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <InputGroup>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                aria-describedby="usernameHelpBlock"
                className={touched.username && errors.username && "invalid"}
                {...getFieldProps("username")}
              />
              {errors.username && (
                <div id="usernameHelpBlock" className="help-block text-red">
                  <ErrorMessage name="username" />
                </div>
              )}
            </InputGroup>

            {/* Password */}
            <InputGroup>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                aria-describedby="passwordHelpBlock"
                className={touched.password && errors.password && "invalid"}
                {...getFieldProps("password")}
              />
              {errors.password && (
                <div id="passwordHelpBlock" className="help-block text-red">
                  <ErrorMessage name="password" />
                </div>
              )}
            </InputGroup>

            {/* Submit */}
            <InputGroup>
              <button type="submit">Sign in</button>
            </InputGroup>
          </form>
        )}
      </Formik>
    </LoginContainer>
  );
};

export default Login;