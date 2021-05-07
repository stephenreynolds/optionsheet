import { Link } from "react-router-dom";
import styled from "styled-components";

const ButtonLink = styled(Link)`
  padding: 0.5rem;
  font-size: 16px;
  text-decoration: none;
  transition: opacity 0.4s;
  color: #fff;

  &:hover {
    opacity: 0.75;
    text-decoration: none;
    color: #fff;
  }
`;

const LoginLink = styled(ButtonLink)``;

const SignUpLink = styled(ButtonLink)`
  border: 1px solid #fff;
  border-radius: 5px;
  margin-left: 0.5rem;
`;

const LoginMenu = (): JSX.Element => {
  return (
    <>
      <LoginLink to="/login">Sign in</LoginLink>
      <SignUpLink to="/register">Sign up</SignUpLink>
    </>
  );
};

export default LoginMenu;
