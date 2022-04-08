import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { checkCredentials, register } from "../../common/api/auth";
import { CreateUserModel } from "../../common/models/user";
import { getAuthenticatedUser, logout } from "../../redux/actions/userActions";
import { getIsLoggedIn } from "../../redux/selectors/userSelectors";
import { InputGroup, RegisterContainer, SignInContainer } from "./style";

const initialValues: CreateUserModel = {
  username: "",
  email: "",
  password: "",
  confirm: ""
};

const validationSchema = yup.object({
  username: yup
    .string()
    .required("Username is required.")
    .test(
      "checkUsername",
      "That username is not available.",
      async (value) => value && await checkCredentials({ username: value })
    ),
  email: yup
    .string()
    .email("Must be a valid email address.")
    .required("Email address is required.")
    .test(
      "checkEmail",
      "That email is already in use.",
      async (value) => value && await checkCredentials({ email: value })
    ),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters.")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter."
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter."
    )
    .matches(/(?=.*[0-9])/, "Password must contain at least one digit.")
    .matches(
      /(?=.*[^A-Za-z0-9])/,
      "Password must contain at least one special character."
    )
    .required("Password is required."),
  confirm: yup
    .string()
    .when("password", {
      is: val => (val && val.length > 0),
      then: yup.string().oneOf(
        [yup.ref("password")],
        "Password must match."
      )
    })
    .required("Re-enter password.")
});

const Register = () => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = (model: CreateUserModel) => {
    register(model)
      .then(() => {
        dispatch(getAuthenticatedUser());
      })
      .catch((error) => {
        dispatch(logout());
        setRegisterError(error.message);
      });
  };

  return (
    <RegisterContainer className="mt-1">
      <h1 className="text-center">Create an account</h1>

      {registerError.length > 0 && (
        <div className="register-error">
          <FontAwesomeIcon icon={faCircleExclamation} className="error-icon" />
          {registerError}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        onSubmit={onSubmit}>
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
              {touched.username && errors.username && (
                <div id="usernameHelpBlock" className="help-block text-red">
                  <ErrorMessage name="username" />
                </div>
              )}
            </InputGroup>

            {/* Email */}
            <InputGroup>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                aria-describedby="emailHelpBlock"
                className={touched.email && errors.email && "invalid"}
                {...getFieldProps("email")}
              />
              {touched.email && errors.email && (
                <div id="emailHelpBlock" className="help-block text-red">
                  <ErrorMessage name="email" />
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
              {touched.password && errors.password && (
                <div id="passwordHelpBlock" className="help-block text-red">
                  <ErrorMessage name="password" />
                </div>
              )}
            </InputGroup>

            {/* Confirm password */}
            <InputGroup>
              <label htmlFor="confirm">Confirm password</label>
              <input
                type="password"
                name="confirm"
                aria-describedby="confirmHelpBlock"
                className={touched.confirm && errors.confirm && "invalid"}
                {...getFieldProps("confirm")}
              />
              {touched.confirm && errors.confirm && (
                <div id="confirmHelpBlock" className="help-block text-red">
                  <ErrorMessage name="confirm" />
                </div>
              )}
            </InputGroup>

            {/* Submit */}
            <InputGroup>
              <button type="submit">
                Create
                account
              </button>
            </InputGroup>

            <SignInContainer>
              Already have an account? <Link to="/login">Sign in.</Link>
            </SignInContainer>
          </form>
        )}
      </Formik>
    </RegisterContainer>
  );
};

export default Register;