import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/authActions";
import { getMyInfo } from "../../../redux/selectors/user";
import { StyledDropdownButton, StyledDropdownItem } from "./user-menu.styles";

const UserMenu = (): JSX.Element => {
  const user = useSelector((state) => getMyInfo(state));
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <StyledDropdownButton
        menuAlign="right"
        title={user.username ? user.username : ""}
      >
        <StyledDropdownItem href={`/${user.username}`}>
          Profile
        </StyledDropdownItem>
        <StyledDropdownItem href="/settings">Settings</StyledDropdownItem>
        <Dropdown.Divider />
        <StyledDropdownItem onClick={onLogout}>Sign out</StyledDropdownItem>
      </StyledDropdownButton>
    </>
  );
};

export default UserMenu;
