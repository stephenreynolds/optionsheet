import { Link } from "react-router-dom";
import { Centered, ErrorMessage, Form, InputGroup } from "./register.styles";
import { useState } from "react";
import { CreateUserModel } from "../../common/user";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createUser } from "../../redux/actions/userActions";

interface Props {
  createUser: (user: CreateUserModel) => any;
}

const Register = ({ createUser }: Props): JSX.Element => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);

  const onUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
  };

  const onEmailChange = (e) => {
    const value = e.target.value;
    validateEmail(value);
    setEmail(value);
  };

  const onPasswordChange = (e) => {
    const value = e.target.value;
    validatePassword(value);
    setPassword(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const usernameIsValid = validateUsername(username);
    const emailIsValid = validateEmail(email);
    const passwordIsValid = validatePassword(password);

    if (usernameIsValid && emailIsValid && passwordIsValid) {
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
          console.log(error);
        });
    }
  };

  const validateUsername = (value: string): boolean => {
    return value.length > 0;
  };

  const validateEmail = (value: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const message =
      regex.test(value) || value.length === 0
        ? ""
        : "Please enter a valid email address.";
    setEmailError(message);
    return message.length === 0;
  };

  const validatePassword = (value: string): boolean => {
    const minLength = 8;
    const lowercase = /(?=.*[a-z])/;
    const uppercase = /(?=.*[A-Z])/;
    const digit = /(?=.*[0-9])/;
    const special = /(?=.*[^A-Za-z0-9])/;

    if (value.length === 0) {
      setPasswordErrors([]);
      return false;
    }

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

    setPasswordErrors(errors);

    return passwordErrors.length === 0;
  };

  return (
    <Centered>
      <h1>Create an account</h1>

      <Form>
        <InputGroup>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={onUsernameChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={onEmailChange}
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

        <button type="submit" onClick={onSubmit}>
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

const mapDispatchToProps = (dispatch) => {
  return {
    createUser: bindActionCreators(createUser, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(Register);
