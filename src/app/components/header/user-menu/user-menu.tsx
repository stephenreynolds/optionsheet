import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/authActions";
import { getMyInfo } from "../../../redux/selectors/user";
import { StyledDropdownButton, StyledDropdownItem, StyledIcon } from "./user-menu.styles";
import { faBell } from "@fortawesome/free-regular-svg-icons";

const UserMenu = (): JSX.Element => {
  const user = useSelector((state) => getMyInfo(state));
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <StyledIcon icon={faBell} />
      <StyledDropdownButton
        menuAlign="right"
        title={user.username ? user.username : ""}
      >
        <StyledDropdownItem href={`/profile`}>Profile</StyledDropdownItem>
        <StyledDropdownItem href="/settings">Settings</StyledDropdownItem>
        <Dropdown.Divider />
        <StyledDropdownItem onClick={onLogout}>Sign out</StyledDropdownItem>
      </StyledDropdownButton>
    </>
  );
};

export default UserMenu;
