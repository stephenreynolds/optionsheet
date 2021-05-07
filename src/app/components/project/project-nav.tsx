import { Nav } from "react-bootstrap";
import styled from "styled-components";
import { Link, useLocation, useParams } from "react-router-dom";
import colors from "../colors";

const StyledNav = styled(Nav)`
  a {
    color: ${colors.textColor};
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
    <StyledNav variant="pills" defaultActiveKey={location.pathname}>
      <Nav.Item>
        <Nav.Link as={Link} to={projectRoot} eventKey={projectRoot}>
          Trades
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to={`${projectRoot}/settings`} eventKey={`${projectRoot}/settings`}>
          Settings
        </Nav.Link>
      </Nav.Item>
    </StyledNav>
  );
};

export default ProjectNav;
