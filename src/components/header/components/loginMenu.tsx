import { LoginLink, SignUpLink } from "../style";

const LoginMenu = () => {
  return (
    <>
      <LoginLink to="/login">Sign in</LoginLink>
      <SignUpLink to="/register">Sign up</SignUpLink>
    </>
  );
};

export default LoginMenu;