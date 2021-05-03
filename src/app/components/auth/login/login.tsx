import { Link } from "react-router-dom";
import {
  Centered,
  Form,
  ForgotPassword,
  CreateAccount,
  InputGroup
} from "./login.styles";
import { useState } from "react";

const Login = (): JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const validate = (): boolean => {
    return username.length > 0 && password.length > 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Centered>
      <h1>Sign in</h1>

      <Form onSubmit={onSubmit}>
        <InputGroup>
          <label htmlFor="username">Username or email address</label>
          <input type="text" id="username" onChange={onUsernameChange} />
        </InputGroup>

        <InputGroup>
          <label htmlFor="password">
            Password
            <ForgotPassword to="/resetpassword">
              Forgot password?
            </ForgotPassword>
          </label>
          <input type="password" id="password" onChange={onPasswordChange} />
        </InputGroup>

        <button type="submit" disabled={!validate()}>
          Sign in
        </button>
      </Form>

      <CreateAccount>
        New to OptionSheet? <Link to="/register">Create an account</Link>.
      </CreateAccount>
    </Centered>
  );
};

export default Login;
