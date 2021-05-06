import { Link } from "react-router-dom";
import styled from "styled-components";

export const ButtonLink = styled(Link)`
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

export const LoginLink = styled(ButtonLink)``;

export const SignUpLink = styled(ButtonLink)`
  border: 1px solid #fff;
  border-radius: 5px;
  margin-left: 0.5rem;
`;
