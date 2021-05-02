import {Link} from "react-router-dom";
import {Centered, Form} from "./register.styles";

const Register = ():JSX.Element => {
  return (
    <Centered>
      <h1>Create an account</h1>

      <Form>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" />
        </div>
        <div>
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>

        <button type="submit">Create account</button>

        <p>By creating an account you agree to our <Link to="/terms">Terms of Service</Link>.</p>
      </Form>
    </Centered>
  );
};

export default Register;