import { LoginLink, SignUpLink } from "./login-menu.styles";

const LoginMenu = (): JSX.Element => {
  return (
    <>
      <LoginLink to="/login">Sign in</LoginLink>
      <SignUpLink to="/register">Sign up</SignUpLink>
    </>
  );
};

export default LoginMenu;
