import { Dropdown, DropdownButton } from "react-bootstrap";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/actions/authActions";
import { getMyInfo } from "../../../redux/selectors/user";

const StyledDropdownButton = styled(DropdownButton)`
  button {
    background-color: transparent;
    border: none;
    outline: none !important;

    &:hover,
    &:focus,
    &:active {
      background-color: transparent !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  color: #000 !important;
  line-height: 1.5rem;

  &:active {
    background-color: initial;
  }
`;

const UserMenu = (): JSX.Element => {
  const user = useSelector((state) => getMyInfo(state));
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <StyledDropdownButton menuAlign="right" title={user.username ? user.username : ""}>
        <StyledDropdownItem href={`/${user.username}`}>Profile</StyledDropdownItem>
        <StyledDropdownItem href="/settings">Settings</StyledDropdownItem>
        <Dropdown.Divider />
        <StyledDropdownItem onClick={onLogout}>Sign out</StyledDropdownItem>
      </StyledDropdownButton>
    </>
  );
};

export default UserMenu;
