import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import { getUser } from "../../redux/selectors/userSelectors";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfileImage from "../shared/profileImage";

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${props => props.theme.dark.text};
  font-size: 10px;
  margin: auto 0.5rem;

  &:hover {
    cursor: pointer;
    color: #aaa;
  }
`;

const Dropdown = styled.button`
  border: none;
  background: none;
  padding: 0;
  user-select: none;

  &:focus, &:focus-visible {
    border: none;
    background: none;
  }

  &:hover {
    background: none;
  }
`;

const DropdownItem = styled.button`
  display: block;
  background: none;
  color: ${props => props.theme.dark.text};
  text-decoration: none;
  text-align: left;
  border: none;
  border-radius: 0;
  padding: 0.5rem 1rem;
  margin: 0;
  width: 100%;

  &:focus {
    border: none;
  }
`;

const DropdownMenu = styled.div`
  border: 1px solid ${props => props.theme.dark.button.border};
  border-radius: 5px;
  margin-top: 0.25rem;
  width: 154px;
  position: absolute;
  right: 32px;
  background-color: ${props => props.theme.dark.fg};
`;

const UserMenu = () => {
  const user = useSelector((state) => getUser(state));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  if (!user) {
    return null;
  }

  const onToggleUserDropdown = (e) => {
    e.preventDefault();
    setShowUserDropdown(!showUserDropdown);
  };

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navigateTo = (e, path) => {
    onToggleUserDropdown(e);
    navigate(path);
  };

  return (
    <>
      <Dropdown onClick={onToggleUserDropdown}>
        <div className="d-flex">
          <div style={{ height: "24px", width: "24px" }}>
            <ProfileImage imageUrl={user.avatar_url} username={user.username} />
          </div>
          <StyledIcon icon={faCaretDown} />
        </div>
      </Dropdown>
      {showUserDropdown && (
        <DropdownMenu>
          <DropdownItem onClick={e => navigateTo(e, `/${user.username}`)}>Profile</DropdownItem>
          <DropdownItem onClick={e => navigateTo(e, "/settings/profile")}>Settings</DropdownItem>
          <hr className="m-0" />
          <DropdownItem onClick={onLogout}>Sign out</DropdownItem>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserMenu;
