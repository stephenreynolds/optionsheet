import {
  BrandLink,
  LoginLink,
  Nav,
  NavHeader,
  SignUpLink,
  UserMenu
} from "./header.styles";
import { Container } from "../layout/container";

interface Props {
  transparent?: boolean;
}

const Header = ({ transparent }: Props): JSX.Element => {
  return (
    <NavHeader transparent={transparent}>
      <Container>
        <Nav>
          <BrandLink to="/">OptionSheet</BrandLink>

          <UserMenu>
            <LoginLink to="/authenticate/login">Sign in</LoginLink>
            <SignUpLink to="/authenticate/register">Sign up</SignUpLink>
          </UserMenu>
        </Nav>
      </Container>
    </NavHeader>
  );
};

export default Header;
