import styled from "styled-components";
import {Navbar} from "react-bootstrap";

export const StyledNavbar = styled(Navbar)`
  background-color: ${(props) =>
    props.transparent ? "transparent" : "#2b2b2b"};
`;

export const StyledBrand = styled(Navbar.Brand)`
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  transition: opacity 0.4s;
  color: #fff !important;

  &:hover {
    opacity: 0.75;
    text-decoration: none;
  }
`;

export const RightMenu = styled.div`
  flex: 1 1 auto;
  text-align: right;
`;