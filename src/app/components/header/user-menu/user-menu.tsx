import { Dropdown, DropdownButton } from "react-bootstrap";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/actions/authActions";

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
  const dispatch = useDispatch();

  const onLogout = (e) => {
    dispatch(logout());
  };

  return (
    <>
      <StyledDropdownButton menuAlign="right" title="Username">
        <StyledDropdownItem href="/profile">Profile</StyledDropdownItem>
        <StyledDropdownItem href="/settings">Settings</StyledDropdownItem>
        <Dropdown.Divider />
        <StyledDropdownItem onClick={onLogout}>Sign out</StyledDropdownItem>
      </StyledDropdownButton>
    </>
  );
};

export default UserMenu;
