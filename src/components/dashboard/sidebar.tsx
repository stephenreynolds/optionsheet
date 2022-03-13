import styled from "styled-components";
import { useNavigate } from "react-router";
import ProjectList from "./projectList";

const SidebarContainer = styled.aside`
  background-color: ${props => props.theme.dark.bg};
  border-left: 1px solid ${props => props.theme.dark.input.border};
  padding: 32px;
  width: 200px;
  
  h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.2rem;
  }
`;

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