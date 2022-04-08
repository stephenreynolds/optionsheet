import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/actions/userActions";
import { getUser } from "../../../redux/selectors/userSelectors";
import ProfileImage from "../../profileImage";
import { Dropdown, DropdownItem, DropdownMenu, StyledIcon } from "../style";

const UserMenu = () => {
  const user = useSelector((state) => getUser(state));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>();

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const isClickedOutside = (e) => {
      if (showDropdown && ref.current && !ref.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", isClickedOutside);

    return () => {
      document.removeEventListener("mousedown", isClickedOutside);
    };
  }, [showDropdown]);

  if (!user) {
    return null;
  }

  const onToggleUserDropdown = (e: MouseEvent) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navigateTo = (e: MouseEvent, path: string) => {
    onToggleUserDropdown(e);
    navigate(path);
  };

  return (
    <>
      <Dropdown onClick={onToggleUserDropdown}>
        <div className="d-flex">
          <div style={{ height: "24px", width: "24px" }}>
            <ProfileImage imageUrl={user.avatarUrl} username={user.username} />
          </div>
          <StyledIcon icon={faCaretDown} />
        </div>
      </Dropdown>
      {showDropdown && (
        <DropdownMenu ref={ref}>
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
