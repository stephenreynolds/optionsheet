import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PromiseDispatch } from "redux/promiseDispatch";
import styled from "styled-components";
import * as projectActions from "../../redux/actions/projectActions";
import { apiCallsInProgress } from "../../redux/selectors/apiSelectors";
import { getProjects } from "../../redux/selectors/projectSelectors";
import { getMyUsername } from "../../redux/selectors/userSelectors";

const ProjectListNav = styled.div`
  ul {
    list-style: none;
    padding-left: 0;

    li {
      margin-top: 0.5rem;

      a {
        color: ${props => props.theme.dark.text};
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  input {
    margin: 0;
    width: 100%;
  }
`;

const ProjectList = () => {
  const loading = useSelector((state) => apiCallsInProgress(state));
  const username = useSelector((state) => getMyUsername(state));
  const projects = useSelector((state) => getProjects(state));
  const dispatch: PromiseDispatch = useDispatch();

  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (username) {
      dispatch(projectActions.getProjects(username)).then().catch((error) => {
        toast.error(error.message);
      });
    }
  }, [dispatch, username]);

  const onSearchChange = (e) => {
    setFilter(e.target.value);
  };

  if (!projects || loading) {
    return null;
  }

  return (
    <ProjectListNav>
      <input type="text" placeholder="Find a project..." onChange={onSearchChange} />
      <ul>
        {projects
          .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
          .sort((a, b) => b.lastEdited.getTime() - a.lastEdited.getTime())
          .map((project, i) => (
            <li key={i}>
              <Link to={`/${username}/${project.name}`}>{project.name}</Link>
            </li>
          ))}
      </ul>
    </ProjectListNav>
  );
};

export default ProjectList;