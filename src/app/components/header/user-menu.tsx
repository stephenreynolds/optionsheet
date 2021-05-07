import { Dropdown, DropdownButton } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import { getMyInfo } from "../../redux/selectors/userSelectors";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const StyledDropdownButton = styled(DropdownButton)`
  display: inline-block;

  button {
    background-color: transparent !important;
    border: none;
    outline: none !important;

    &:hover,
    &:focus,
    &:active {
      color: #aaa;
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

const StyledIcon = styled(FontAwesomeIcon)`
  color: #fff;
  margin: auto 0.5rem;
  font-size: 18px;

  &:hover {
    cursor: pointer;
    color: #aaa;
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
