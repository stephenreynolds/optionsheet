import {RightMenu, StyledBrand, StyledNavbar} from "./header.styles";
import UserMenu from "./user-menu/user-menu";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/selectors/user";
import LoginMenu from "./login-menu/login-menu";
import {Navbar} from "react-bootstrap";

interface Props {
  transparent?: boolean;
}

const Header = ({ transparent }: Props): JSX.Element => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));

  return (
    <StyledNavbar expand="lg" transparent={transparent.toString()}>
      <StyledBrand href="/">OptionSheet</StyledBrand>
      <Navbar.Toggle aria-controls="navbar" />
      <Navbar.Collapse id="navbar">
        <RightMenu>
          {isLoggedIn ? <UserMenu /> : <LoginMenu />}
        </RightMenu>
      </Navbar.Collapse>
    </StyledNavbar>
  );
};

export default Header;
