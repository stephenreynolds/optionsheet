import { StyledSidebar } from "./sidebar.styles";
import { Button } from "react-bootstrap";
import ProjectList from "./project-list/project-list";

const Sidebar = () => {
  return (
    <StyledSidebar className="col-2">
      <div className="d-flex my-2">
        <h6 className="flex-grow-1">Projects</h6>
        <Button variant="success" size="sm">
          New
        </Button>
      </div>
      <ProjectList />
    </StyledSidebar>
  );
};

export default Sidebar;
