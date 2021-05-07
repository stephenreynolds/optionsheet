import { Button, Nav } from "react-bootstrap";
import styled from "styled-components";
import { Link, useLocation, useParams } from "react-router-dom";
import colors from "../colors";

const StyledNav = styled(Nav)`
  .nav-item {
    margin-right: 0.5rem;

    a {
      color: ${colors.textColor};
      background-color: ${colors.backgroundDark.lighten(1)};
    }
  }
`;

const ProjectHeader = styled.div`
  width: 100%;
  display: flex;
  background-color: ${colors.backgroundDark.lighten(0.3)};
  border-radius: 10px;
  padding: 0.25rem 0;

  h5 {
    margin: auto 0 auto 0.5rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .buttons {
    width: fit-content;
    display: flex;
    flex-shrink: 0;
    
    button {
      margin: auto 1rem;
    }
  }
`;

const ProjectNav = () => {
  const { username, project } = useParams<{
    username: string;
    project: string;
  }>();
  const location = useLocation();
  const projectRoot = `/user/${username}/project/${project}`;

  return (
    <ProjectHeader>
      <h5>{project}</h5>
      <div className="buttons">
        <Button variant="success">New trade</Button>
        <StyledNav variant="pills" defaultActiveKey={location.pathname}>
          <Nav.Item>
            <Nav.Link as={Link} to={projectRoot} eventKey={projectRoot}>
              Trades
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as={Link}
              to={`${projectRoot}/settings`}
              eventKey={`${projectRoot}/settings`}
            >
              Settings
            </Nav.Link>
          </Nav.Item>
        </StyledNav>
      </div>
    </ProjectHeader>
  );
};

export default ProjectNav;
