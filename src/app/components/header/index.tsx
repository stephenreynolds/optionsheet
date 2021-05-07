import UserMenu from "./user-menu";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/selectors/userSelectors";
import LoginMenu from "./login-menu";
import { Container, Navbar } from "react-bootstrap";
import Search from "./search";
import colors from "../colors";
import styled from "styled-components";

const StyledNavbar = styled(Navbar)`
  background-color: transparent;
  margin-bottom: 0.5rem;
`;

const StyledBrand = styled(Navbar.Brand)`
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  transition: opacity 0.4s;
  color: ${colors.textColor} !important;

  &:hover {
    opacity: 0.75;
    text-decoration: none;
  }
`;

const RightMenu = styled.div`
  flex: 1 1 auto;
  text-align: right;
`;

const Header = (): JSX.Element => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));

  return (
    <StyledNavbar>
      <Container>
        <StyledBrand href="/">OptionSheet</StyledBrand>
        <Search />
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <RightMenu>{isLoggedIn ? <UserMenu /> : <LoginMenu />}</RightMenu>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;
