import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "../../redux/selectors/projectSelectors";
import { useEffect, useState } from "react";
import { getMyInfo } from "../../redux/selectors/userSelectors";
import * as actions from "../../redux/actions/projectActions";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import colors from "../colors";
import styled from "styled-components";

const ProjectListContainer = styled.aside`
  border: 1px solid #000;
  border-radius: 5px;
  background-color: ${colors.backgroundDark.lighten(0.4)};
  padding: 1rem;
  height: fit-content;
  max-width: 255px;
`;

const ProjectListNav = styled.nav`
  margin-top: 0.5rem;
  
  ul {
    list-style: none;
    padding-left: 0;
    margin-bottom: 0;

    a {
      font-weight: 600;
      color: ${colors.textColor}
    }
  }
`;

const ProjectList = () => {
  const currentUser = useSelector((state) => getMyInfo(state));
  const projects = useSelector((state) => getProjects(state));
  const dispatch = useDispatch();

  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (currentUser.id) {
      dispatch(actions.projects(currentUser.id));
    }
  }, [currentUser]);

  const onSearchChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <ProjectListContainer className="col-3">
      <input
        className="form-control form-control-sm w-100"
        type="text"
        placeholder="Find a project..."
        onChange={onSearchChange}
      />
      {projects && (
        <ProjectListNav>
          <ul>
            {projects
              .filter((p) =>
                p.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map((project, i) => (
                <li key={i}>
                  <OverlayTrigger
                    placement="auto"
                    delay={{ show: 250, hide: 0 }}
                    overlay={
                      <Tooltip id="link-tooltip">{project.description}</Tooltip>
                    }
                  >
                    <Link
                      to={`/user/${currentUser.username}/project/${project.name}`}
                    >
                      {project.name}
                    </Link>
                  </OverlayTrigger>
                </li>
              ))}
          </ul>
        </ProjectListNav>
      )}
    </ProjectListContainer>
  );
};

export default ProjectList;
