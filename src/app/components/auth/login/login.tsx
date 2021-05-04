import { Link } from "react-router-dom";
import {
  LoginForm,
  ForgotPassword,
  CreateAccount
} from "./login.styles";
import { useState } from "react";
import Input from "../../layout/input";
import Button from "../../layout/button";
import Label from "../../layout/label";
import InputGroup from "../../layout/inputGroup";

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
    <LoginForm onSubmit={onSubmit} className="mx-auto">
      <h1 className="text-center">Sign in</h1>

      <InputGroup>
        <Label htmlFor="username">Username or email address</Label>
        <Input type="text" id="username" onChange={onUsernameChange} />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="password">
          Password
          <ForgotPassword to="/resetpassword">
            Forgot password?
          </ForgotPassword>
        </Label>
        <Input type="password" id="password" onChange={onPasswordChange} />
      </InputGroup>

      <Button type="submit" color="green" disabled={!validate()}>
        Sign in
      </Button>

      <CreateAccount>
        New to OptionSheet? <Link to="/register">Create an account</Link>.
      </CreateAccount>
    </LoginForm>
  );
};

export default Login;
