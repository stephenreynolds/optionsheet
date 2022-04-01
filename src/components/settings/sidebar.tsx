import { NavLink } from "react-router-dom";
import styled from "styled-components";
import color from "color";
import { faGear, faUser, faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SidebarContainer = styled.aside`
  margin-right: 3rem;

  ul {
    margin: 0.2rem 0 0;
    padding: 0;
    list-style-type: none;

    li {
      width: 256px;
      margin-bottom: 0.1em;

      a {
        display: inline-block;
        color: ${props => props.theme.dark.text};
        width: 100%;
        padding-left: 1em;
        line-height: 2.25em;
        border-radius: 10px;

        &.selected {
          background-color: ${props => color(props.theme.dark.text).fade(0.9)};
          font-weight: 600;
        }

        &:hover {
          background-color: ${props => color(props.theme.dark.text).fade(0.85)};
          cursor: pointer;
          text-decoration: none;
        }

        .svg-inline--fa {
          margin-right: 1ch;
        }
      }
    }
  }
`;

const activeClassName = ({ isActive }) => isActive ? "selected" : undefined;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <ul>
        <li>
          <NavLink to="profile" className={activeClassName} end>
            <FontAwesomeIcon icon={faUser} />
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="account" className={activeClassName} end>
            <FontAwesomeIcon icon={faGear} />
            Account
          </NavLink>
        </li>
        <li>
          <NavLink to="projects" className={activeClassName} end>
            <FontAwesomeIcon icon={faDiagramProject} />
            Projects
          </NavLink>
        </li>
      </ul>
    </SidebarContainer>
  );
};

export default Sidebar;