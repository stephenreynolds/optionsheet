import { Link, Redirect } from "react-router-dom";
import {LoginForm, ForgotPassword, CreateAccount, ErrorMessage} from "./login.styles";
import { useState } from "react";
import Input from "../../layout/input";
import Button from "../../layout/button";
import Label from "../../layout/label";
import InputGroup from "../../layout/inputGroup";
import { Credentials } from "../../../common/user";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as authActions from "../../../redux/actions/authActions";

interface Props {
  isLoggedIn: boolean;
  message: string;
  actions: {
    login: (credentials: Credentials) => any;
  };
}

const Login = ({ isLoggedIn, message, actions }: Props): JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

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

      actions
        .login(credentials)
        .then()
        .catch(() => {
          setLoginError(message);
        });
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
        <Input type="text" id="username" onChange={onUsernameChange} />
      </InputGroup>

      <InputGroup>
        <Label htmlFor="password">
          Password
          <ForgotPassword to="/resetpassword">Forgot password?</ForgotPassword>
        </Label>
        <Input type="password" id="password" onChange={onPasswordChange} />
      </InputGroup>

      <ErrorMessage>{loginError}</ErrorMessage>

      <Button type="submit" color="green" disabled={!validate()}>
        Sign in
      </Button>

      <CreateAccount>
        New to OptionSheet? <Link to="/register">Create an account</Link>.
      </CreateAccount>
    </LoginForm>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authenticateReducer.isLoggedIn,
    message: state.message
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      login: bindActionCreators(authActions.login, dispatch)
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
