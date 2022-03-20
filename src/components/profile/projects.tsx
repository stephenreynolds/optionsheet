import { useEffect, useState } from "react";
import { getProjects } from "../../common/api/projects";
import { toast } from "react-toastify";
import ProjectList from "./projectList";

const ProfileProjects = ({ username }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (username) {
      getProjects(username)
        .then(results => setProjects(results.data))
        .catch(error => toast(error.message));
    }
  }, [username]);

  return <ProjectList projects={projects} />;
};

export default ProfileProjects;