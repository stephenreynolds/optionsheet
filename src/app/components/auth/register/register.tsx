import { Link } from "react-router-dom";
import { Centered, ErrorMessage, Form, InputGroup } from "./register.styles";
import { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateUsername,
  CreateUserModel
} from "../../../common/user";
import {
  checkEmail,
  checkUsername,
  createUser
} from "../../../common/userManager";

const Register = (): JSX.Element => {
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

    createUser(user)
      .then(() => {
        console.log("Created user");
      })
      .catch((error) => {
        setSubmitError(error.response.data);
      });
  };

  const validateAll = (): boolean => {
    return (
      validateUsername(username) &&
      validateEmail(email) &&
      validatePassword(password)
    );
  };

  return (
    <Centered>
      <h1>Create an account</h1>

      <Form onSubmit={onSubmit}>
        <InputGroup>
          <label htmlFor="username">Username</label>
          <input
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
          <label htmlFor="email">Email address</label>
          <input
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
          <label htmlFor="password">Password</label>
          <input
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

        <button type="submit" disabled={!validateAll()}>
          Create account
        </button>

        <p>
          By creating an account you agree to our{" "}
          <Link to="/terms">Terms of Service</Link>.
        </p>
      </Form>
    </Centered>
  );
};

export default Register;
