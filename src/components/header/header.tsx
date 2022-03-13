import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/selectors/authSelectors";
import UserMenu from "./userMenu";
import LoginMenu from "./loginMenu";
import Search from "./search";

const StyledHeader = styled.header`
  background-color: ${props => props.theme.dark.fg};
  padding: 12px 32px;
  display: flex;
  align-items: center;
`;

const BrandLink = styled(Link)`
  color: ${props => props.theme.dark.text};
  text-decoration: none;
  transition: opacity 0.4s ease;

  &:hover {
    opacity: 0.75;
    text-decoration: none;
  }
`;

const RightMenu = styled.div`
  flex: 1 1 auto;
  text-align: right;
`;

const Header = () => {
  const isLoggedIn = useSelector(state => getIsLoggedIn(state));

  return (
    <StyledHeader>
      <BrandLink to="/"><h2 className="m-0">OptionSheet</h2></BrandLink>
      <Search />
      <RightMenu>
        {isLoggedIn ? <UserMenu /> : <LoginMenu />}
      </RightMenu>
    </StyledHeader>
  );
};

export default Header;