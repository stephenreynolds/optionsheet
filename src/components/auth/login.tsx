import { getIsLoggedIn } from "../../redux/selectors/authSelectors";
import { Container } from "../styles";
import styled from "styled-components";
import { Credentials } from "../../common/models/user";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../../redux/actions/authActions";
import { PromiseDispatch } from "../../redux/promiseDispatch";
import { ErrorMessage, Formik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import color from "color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginContainer = styled(Container)`
  width: 400px;

  .login-error {
    display: inline-block;
    box-sizing: border-box;
    margin-bottom: 1rem;
    padding: 0.5rem;
    width: 100%;
    background-color: ${props => color(props.theme.dark.invalid).darken(0.5)};
    border-radius: 5px;
    
    .error-icon {
      margin-right: 1ch;
    }
  }

  .help-block {
    display: inline-block;
    margin: 0.5rem 0;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 0.5rem;
  width: 100%;

  label {
    display: block;
  }

  input {
    margin-left: 0;
    width: 100%;
  }

  button {
    width: 100%;
    margin: 0;
  }
`;

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
  const dispatch: PromiseDispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (credentials: Credentials) => {
    dispatch(authActions.login(credentials))
      .then()
      .catch((error) => {
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