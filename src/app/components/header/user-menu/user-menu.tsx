import { Dropdown, DropdownButton } from "react-bootstrap";
import styled from "styled-components";
import { PromiseDispatch } from "../../../redux/promiseDispatch";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/actions/authActions";
import { Redirect } from "react-router-dom";

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

interface Props {
  isLoggedIn: boolean;
}

const UserMenu = ({ isLoggedIn }: Props): JSX.Element => {
  const dispatch = useDispatch();

  const onLogout = (e) => {
    dispatch(logout());
  };

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

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
