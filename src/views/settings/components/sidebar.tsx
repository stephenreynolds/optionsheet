import { NavLink } from "react-router-dom";
import { faDiagramProject, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VerticalNav from "../../../components/verticalNav";

const activeClassName = ({ isActive }) => isActive ? "selected" : undefined;

const Sidebar = () => {
  return (
    <VerticalNav style={{ width: "256px" }}>
      <NavLink to="profile" className={activeClassName} end>
        <FontAwesomeIcon icon={faUser} />
        Profile
      </NavLink>
      <NavLink to="account" className={activeClassName} end>
        <FontAwesomeIcon icon={faGear} />
        Account
      </NavLink>
      <NavLink to="projects" className={activeClassName} end>
        <FontAwesomeIcon icon={faDiagramProject} />
        Projects
      </NavLink>
    </VerticalNav>
  );
};

export default Sidebar;