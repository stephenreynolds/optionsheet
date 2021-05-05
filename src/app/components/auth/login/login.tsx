import { Link, Redirect } from "react-router-dom";
import {
  LoginForm,
  ForgotPassword,
  CreateAccount,
  ErrorMessage
} from "./login.styles";
import { useState } from "react";
import Input from "../../layout/input";
import Button from "../../layout/button";
import Label from "../../layout/label";
import InputGroup from "../../layout/inputGroup";
import { Credentials } from "../../../common/user";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../../../redux/actions/authActions";
import { getIsLoggedIn, getMessage } from "../../../redux/selectors/user";
import { PromiseDispatch } from "../../../redux/promiseDispatch";

const Login = (): JSX.Element => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const message = useSelector((state) => getMessage(state));

  const dispatch: PromiseDispatch = useDispatch();

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
    if (validate()) {
      const credentials: Credentials = {
        username,
        password
      };

      dispatch(authActions.login(credentials)).then();
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/profile" />;
  }

  return (
    <LoginForm onSubmit={onSubmit} className="mx-auto">
      <h1 className="text-center">Sign in</h1>

      <InputGroup>
        <Label htmlFor="username">Username or email address</Label>
        <Input
          type="text"
          id="username"
          onChange={onUsernameChange}
          tabIndex={1}
        />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="password">
          Password
          <ForgotPassword to="/resetpassword" tabIndex={4}>
            Forgot password?
          </ForgotPassword>
        </Label>
        <Input
          type="password"
          id="password"
          onChange={onPasswordChange}
          tabIndex={2}
        />
      </InputGroup>

      <ErrorMessage>{message}</ErrorMessage>

      <Button type="submit" color="green" disabled={!validate()} tabIndex={3}>
        Sign in
      </Button>

      <CreateAccount>
        New to OptionSheet?{" "}
        <Link to="/register" tabIndex={5}>
          Create an account
        </Link>
        .
      </CreateAccount>
    </LoginForm>
  );
};

export default Login;
