import { LoginLink, SignUpLink } from "./login-menu.styles";

const LoginMenu = (): JSX.Element => {
  return (
    <>
      <LoginLink to="/authenticate/login">Sign in</LoginLink>
      <SignUpLink to="/authenticate/register">Sign up</SignUpLink>
    </>
  );
};

export default LoginMenu;
