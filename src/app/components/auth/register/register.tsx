import { Link, Redirect } from "react-router-dom";
import { ErrorMessage, RegisterForm } from "./register.styles";
import { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  CreateUserModel,
  Credentials
} from "../../../common/user";
import { checkEmail, checkUsername } from "../../../common/userManager";
import Input from "../../layout/input";
import Button from "../../layout/button";
import Label from "../../layout/label";
import InputGroup from "../../layout/inputGroup";
import { bindActionCreators } from "redux";
import * as authActions from "../../../redux/actions/authActions";
import { connect } from "react-redux";

interface Props {
  isLoggedIn: boolean;
  message: string;
  actions: {
    register: (model: CreateUserModel) => any;
    login: (credentials: Credentials) => any;
  };
}

const Register = ({ isLoggedIn, message, actions }: Props): JSX.Element => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [submitError, setSubmitError] = useState("");

  const onUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setUsernameError("");
  };

  const onUsernameBlur = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      checkUsername(value).then((message) => {
        setUsernameError(message);
      });
    }
  };

  const onEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(
      validateEmail(value) || value.length === 0
        ? ""
        : "Please enter a valid email address."
    );
  };

  const onEmailBlur = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      checkEmail(value).then((message) => {
        setEmailError(message);
      });
    }
  };

  const onPasswordChange = (e) => {
    const value = e.target.value;
    const minLength = 8;
    const lowercase = /(?=.*[a-z])/;
    const uppercase = /(?=.*[A-Z])/;
    const digit = /(?=.*[0-9])/;
    const special = /(?=.*[^A-Za-z0-9])/;
    const errors = [];

    if (!lowercase.test(value)) {
      errors.push("At least one lowercase letter");
    }
    if (!uppercase.test(value)) {
      errors.push("At least one uppercase letter");
    }
    if (!digit.test(value)) {
      errors.push("At least one digit");
    }
    if (!special.test(value)) {
      errors.push("At least one special character");
    }
    if (value.length < minLength) {
      errors.push(`At least ${minLength} characters long`);
    }

    if (value.length === 0) {
      setPasswordErrors([]);
    } else {
      setPasswordErrors(errors);
    }

    setPassword(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    const user: CreateUserModel = {
      username,
      email,
      password
    };

    actions
      .register(user)
      .then(() => {
        actions.login({ username, password }).then();
      })
      .catch(() => {
        setSubmitError(message);
      });
  };

  const validateAll = (): boolean => {
    return (
      validateUsername(username) &&
      validateEmail(email) &&
      validatePassword(password)
    );
  };

  if (isLoggedIn) {
    return <Redirect to="/profile" />;
  }

  return (
    <RegisterForm onSubmit={onSubmit} className="mx-auto">
      <h1 className="text-center">Create an account</h1>

      <InputGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          type="text"
          id="username"
          value={username}
          onChange={onUsernameChange}
          onBlur={onUsernameBlur}
          required
        />
        <ErrorMessage>{usernameError}</ErrorMessage>
      </InputGroup>
      <InputGroup>
        <Label htmlFor="email">Email address</Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={onEmailChange}
          onBlur={onEmailBlur}
          required
        />
        <ErrorMessage>{emailError}</ErrorMessage>
      </InputGroup>
      <InputGroup>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={onPasswordChange}
          required
        />
        <ErrorMessage>
          {passwordErrors.length > 0 && (
            <>
              Please ensure your password contains the following:
              <ul>
                {passwordErrors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </>
          )}
        </ErrorMessage>
      </InputGroup>

      <InputGroup>
        <ErrorMessage>{submitError}</ErrorMessage>
      </InputGroup>

      <Button type="submit" color="green" disabled={!validateAll()}>
        Create account
      </Button>

      <p>
        By creating an account you agree to our{" "}
        <Link to="/terms">Terms of Service</Link>.
      </p>
    </RegisterForm>
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
      register: bindActionCreators(authActions.register, dispatch),
      login: bindActionCreators(authActions.login, dispatch)
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
