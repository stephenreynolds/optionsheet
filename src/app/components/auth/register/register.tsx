import { Link, Redirect } from "react-router-dom";
import { RegisterContainer } from "./register.styles";
import { CreateUserModel } from "../../../common/user";
import {
  checkEmailAvailable,
  checkUsernameAvailable
} from "../../../common/userManager";
import { ErrorMessage, Formik } from "formik";
import * as authActions from "../../../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { getIsLoggedIn } from "../../../redux/selectors/userSelectors";
import { PromiseDispatch } from "../../../redux/promiseDispatch";
import * as yup from "yup";
import { Button, Form } from "react-bootstrap";

const Register = (): JSX.Element => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const dispatch: PromiseDispatch = useDispatch();

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  const onSubmit = (model: CreateUserModel) => {
    dispatch(authActions.register(model)).then(() => {
      dispatch(
        authActions.login({
          username: model.username,
          password: model.password
        })
      ).then();
    });
  };

  const initialValues: CreateUserModel = {
    username: "",
    email: "",
    password: ""
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .required("Username is required")
      .test(
        "checkUsername",
        "That username is not available",
        async (value) => value && !(await checkUsernameAvailable(value))
      ),
    email: yup
      .string()
      .email("Must be a valid email address")
      .required("Email address is required")
      .test(
        "checkEmail",
        "That email is already in use",
        async (value) => value && !(await checkEmailAvailable(value))
      ),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .matches(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .matches(/(?=.*[0-9])/, "Password must contain at least one digit")
      .matches(
        /(?=.*[^A-Za-z0-9])/,
        "Password must contain at least one special character"
      )
      .required("Password is required")
  });

  return (
    <RegisterContainer>
      <h1 className="text-center mb-4">Create an account</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={false}
        onSubmit={onSubmit}
      >
        {({ getFieldProps, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                aria-describedby="usernameHelpBlock"
                {...getFieldProps("username")}
              />
              <Form.Text id="usernameHelpBlock" muted>
                <ErrorMessage name="username" />
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                type="text"
                aria-describedby="emailHelpBlock"
                {...getFieldProps("email")}
              />
              <Form.Text id="emailHelpBlock" muted>
                <ErrorMessage name="email" />
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                aria-describedby="passwordHelpBlock"
                {...getFieldProps("password")}
              />
              <Form.Text id="passwordHelpBlock" muted>
                <ErrorMessage name="password" />
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Button type="submit" variant="success" className="w-100">
                Create account
              </Button>
            </Form.Group>
          </Form>
        )}
      </Formik>

      <p>
        By creating an account you agree to our{" "}
        <Link to="/terms">Terms of Service</Link>.
      </p>
    </RegisterContainer>
  );
};

export default Register;
