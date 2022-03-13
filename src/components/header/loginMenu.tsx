import styled from "styled-components";
import { Link } from "react-router-dom";

const ButtonLink = styled(Link)`
  padding: 0.5rem;
  font-size: 16px;
  text-decoration: none;
  transition: opacity 0.4s ease;
  color: ${props => props.theme.dark.text};

  &:hover {
    opacity: 0.75;
    text-decoration: none;
    color: ${props => props.theme.dark.text};
  }
`;

const LoginLink = styled(ButtonLink)``;

const SignUpLink = styled(ButtonLink)`
  border: 1px solid ${props => props.theme.dark.text};
  border-radius: 5px;
  margin-left: 0.5rem;
`;

const LoginMenu = () => {
  return (
    <>
      <LoginLink to="/login">Sign in</LoginLink>
      <SignUpLink to="/register">Sign up</SignUpLink>
    </>
  );
};

export default LoginMenu;