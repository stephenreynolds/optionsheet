import { useNavigate } from "react-router";
import { SidebarContainer } from "../style";
import ProjectList from "./projectList";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <SidebarContainer>
      <h3>
        Projects
        <button className="btn-green" onClick={() => navigate("/new")}>New</button>
      </h3>
      <ProjectList />
    </SidebarContainer>
  );
};

export default Sidebar;