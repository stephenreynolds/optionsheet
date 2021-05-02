import {
  BrandLink,
  LoginLink,
  Nav,
  NavHeader,
  SignUpLink,
  UserMenu
} from "./header.styles";
import { Container } from "../layout/layout.styles";
import {useLocation} from "react-router";

const Header = (): JSX.Element => {
  const location = useLocation();

  return (
    <NavHeader transparent={location.pathname === "/"}>
      <Container>
        <Nav>
          <BrandLink to="/">OptionSheet</BrandLink>

          <UserMenu>
            <LoginLink to="/login">Sign in</LoginLink>
            <SignUpLink to="/register">Sign up</SignUpLink>
          </UserMenu>
        </Nav>
      </Container>
    </NavHeader>
  );
};

export default Header;
