import { RightMenu, StyledBrand, StyledNavbar } from "./header.styles";
import UserMenu from "./user-menu/user-menu";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/selectors/userSelectors";
import LoginMenu from "./login-menu/login-menu";
import { Navbar } from "react-bootstrap";
import Search from "./search/search";

interface Props {
  transparent?: string;
}

const Header = ({ transparent }: Props): JSX.Element => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));

  return (
    <StyledNavbar expand="lg" transparent={transparent} variant="dark">
      <StyledBrand href="/">OptionSheet</StyledBrand>
      <Search transparent={transparent} />
      <Navbar.Toggle aria-controls="navbar" />
      <Navbar.Collapse id="navbar">
        <RightMenu>{isLoggedIn ? <UserMenu /> : <LoginMenu />}</RightMenu>
      </Navbar.Collapse>
    </StyledNavbar>
  );
};

export default Header;
