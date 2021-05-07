import { Link, Redirect } from "react-router-dom";
import { ErrorMessage, Formik } from "formik";
import { Credentials } from "../../common/models/user";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../../redux/actions/authActions";
import { getIsLoggedIn } from "../../redux/selectors/userSelectors";
import { PromiseDispatch } from "../../redux/promiseDispatch";
import * as yup from "yup";
import { Button, Container, Form } from "react-bootstrap";
import styled from "styled-components";

const LoginContainer = styled(Container)`
  width: 400px;
  margin-top: 1.5rem;
`;

const ForgotPassword = styled(Link)`
  text-align: right;
`;

const CreateAccount = styled.div`
  border: 1px solid #c2c2c2;
  border-radius: 6px;
  padding: 10px;
  text-align: center;
`;

const Login = () => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const dispatch: PromiseDispatch = useDispatch();

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  const onSubmit = (credentials: Credentials) => {
    dispatch(authActions.login(credentials)).then();
  };

  const initialValues: Credentials = {
    username: "",
    password: ""
  };

  return (
    <LoginContainer>
      <h1 className="text-center mb-4">Sign in</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
          username: yup.string().required("Username is required"),
          password: yup.string().required("Password is required")
        })}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={onSubmit}
      >
        {({ getFieldProps, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username or email address</Form.Label>
              <Form.Control
                name="username"
                type="text"
                aria-describedby="usernameHelpBlock"
                tabIndex={1}
                {...getFieldProps("username")}
              />
              <Form.Text id="usernameHelpBlock" muted>
                <ErrorMessage name="username" />
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label className="d-flex flex-grow-1">
                Password
                <ForgotPassword
                  to="/resetpassword"
                  className="flex-fill"
                  tabIndex={3}
                >
                  Forgot password?
                </ForgotPassword>
              </Form.Label>
              <Form.Control
                name="password"
                type="password"
                aria-describedby="passwordHelpBlock"
                tabIndex={2}
                {...getFieldProps("password")}
              />
              <Form.Text id="passwordHelpBlock" muted>
                <ErrorMessage name="password" />
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Button
                type="submit"
                variant="success"
                className="w-100"
                tabIndex={4}
              >
                Sign in
              </Button>
            </Form.Group>
          </Form>
        )}
      </Formik>

      <CreateAccount>
        New to OptionSheet?{" "}
        <Link to="/register" tabIndex={5}>
          Create an account
        </Link>
        .
      </CreateAccount>
    </LoginContainer>
  );
};

export default Login;
