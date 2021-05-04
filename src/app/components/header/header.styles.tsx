import styled from "styled-components";
import { Link } from "react-router-dom";

export const NavHeader = styled.header`
  background-color: ${(props) =>
    props.transparent ? "transparent" : "#2b2b2b"};

  a {
    color: #fff;
  }
`;

export const Nav = styled.nav`
  display: flex;
  line-height: 56px;
`;

export const BrandLink = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  transition: opacity 0.4s;

  &:hover {
    opacity: 0.75;
    text-decoration: none;
  }
`;

export const UserMenu = styled.div`
  flex: 1 1 auto;
  text-align: right;
`;

export const ButtonLink = styled(Link)`
  padding: 0.5rem;
  font-size: 16px;
  text-decoration: none;
  transition: opacity 0.4s;

  &:hover {
    opacity: 0.75;
  }
`;

export const LoginLink = styled(ButtonLink)``;

export const SignUpLink = styled(ButtonLink)`
  border: 1px solid #fff;
  border-radius: 5px;
  margin-left: 0.5rem;
`;
