import { BrandLink, Nav, NavHeader, RightMenu } from "./header.styles";
import { Container } from "../layout/container";
import UserMenu from "./user-menu/user-menu";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/selectors/user";
import LoginMenu from "./login-menu/login-menu";

interface Props {
  transparent?: boolean;
}

const Header = ({ transparent }: Props): JSX.Element => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));

  return (
    <NavHeader transparent={transparent}>
      <Container>
        <Nav>
          <BrandLink to="/">OptionSheet</BrandLink>
          <RightMenu>
            {isLoggedIn ? <UserMenu isLoggedIn={isLoggedIn} /> : <LoginMenu />}
          </RightMenu>
        </Nav>
      </Container>
    </NavHeader>
  );
};

export default Header;
