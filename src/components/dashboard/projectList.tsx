import { ChangeEvent, useEffect, useState } from "react";
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (username) {
      getProjects(username)
        .then((data) => {
          setProjects(data);
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  }, [username]);

  if (!projects || loading) {
    return null;
  }

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  return (
    <ProjectListNav>
      <input type="text" placeholder="Find a project..." onChange={onSearchChange} />
      <VerticalNav>
        {projects
          .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
          .sort((a, b) => b.updatedOn.getTime() - a.updatedOn.getTime())
          .map((project, i) => (
            <Link key={i} to={`/${username}/${project.name}`}>{project.name}</Link>
          ))}
      </VerticalNav>
    </ProjectListNav>
  );
};

export default ProjectList;