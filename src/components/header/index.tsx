import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/selectors/userSelectors";
import LoginMenu from "./components/loginMenu";
import Search from "./components/search";
import { BrandLink, RightMenu, StyledHeader } from "./style";
import UserMenu from "./components/userMenu";

const Header = () => {
  const isLoggedIn = useSelector(state => getIsLoggedIn(state));

  return (
    <StyledHeader>
      <BrandLink to="/">
        <img src="/logo192.png" alt="OptionSheet"/>
        <h2 className="m-0">OptionSheet</h2>
      </BrandLink>
      <Search />
      <RightMenu>
        {isLoggedIn ? <UserMenu /> : <LoginMenu />}
      </RightMenu>
    </StyledHeader>
  );
};

export default Header;