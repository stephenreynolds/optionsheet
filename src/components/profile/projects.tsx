import { useEffect, useState } from "react";
import { getProjects } from "../../common/api/projects";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { TagPill } from "../shared/pill";

const ProjectItem = ({ username, project }) => {
  return (
    <div>
      <h3>
        <Link to={`/${username}/${project.name}`}>
          {project.name}
        </Link>
      </h3>
      <p>{project.description}</p>
      {project.tags.map((tag) => (
        <TagPill key={tag.name}>{tag.name}</TagPill>
      ))}
    </div>
  );
};

const ProfileProjects = ({ user }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user.username) {
      getProjects(user.username)
        .then(results => setProjects(results.data))
        .catch(error => toast(error.message));
    }
  }, [user.username]);

  return (
    <div>
      {projects.map((project, key) => (
        <>
          <hr style={{marginTop: "2rem", marginBottom: "1.5rem"}} />
          <ProjectItem key={key} username={user.username} project={project} />
        </>
      ))}
    </div>
  );
};

export default ProfileProjects;