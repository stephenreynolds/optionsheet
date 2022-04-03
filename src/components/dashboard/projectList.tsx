import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getUsername } from "../../redux/selectors/userSelectors";
import VerticalNav from "../shared/verticalNav";
import { getProjects } from "../../common/api/projects";
import { Project } from "../../common/models/project";

const ProjectListNav = styled.div`
  input {
    margin: 0;
    width: 100%;
  }
`;

const ProjectList = () => {
  const username = useSelector((state) => getUsername(state));

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (username) {
      getProjects(username)
        .then(({ data }) => {
          setProjects(data.map((project: Project) => {
            return {
              ...project,
              updated_on: new Date(project.updated_on)
            };
          }));
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, [username]);

  const onSearchChange = (e) => {
    setFilter(e.target.value);
  };

  if (!projects || loading) {
    return null;
  }

  return (
    <ProjectListNav>
      <input type="text" placeholder="Find a project..." onChange={onSearchChange} />
      <VerticalNav>
        {projects
          .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
          .sort((a, b) => b.updated_on.getTime() - a.updated_on.getTime())
          .map((project, i) => (
            <Link key={i} to={`/${username}/${project.name}`}>{project.name}</Link>
          ))}
      </VerticalNav>
    </ProjectListNav>
  );
};

export default ProjectList;