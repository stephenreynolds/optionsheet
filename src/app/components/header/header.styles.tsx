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

export const RightMenu = styled.div`
  flex: 1 1 auto;
  text-align: right;
`;