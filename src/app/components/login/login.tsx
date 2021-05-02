import { Link } from "react-router-dom";
import { Centered, Form, ForgotPassword, CreateAccount } from "./login.styles";

const Login = (): JSX.Element => {
  return (
    <Centered>
      <h1>Sign in</h1>

      <Form>
        <div>
          <label htmlFor="username">Username or email address</label>
          <input type="text" id="username" />
        </div>

        <div>
          <label htmlFor="password">
            Password{" "}
            <ForgotPassword to="/resetpassword">
              Forgot password?
            </ForgotPassword>
          </label>
          <input type="password" id="password" />
        </div>

        <button type="submit">Sign in</button>
      </Form>

      <CreateAccount>
        New to OptionSheet? <Link to="/register">Create an account</Link>.
      </CreateAccount>
    </Centered>
  );
};

export default Login;
