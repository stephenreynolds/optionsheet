import { useEffect, useState } from "react";
import { getProjects } from "../../common/api/projects";
import { toast } from "react-toastify";
import ProjectList from "./projectList";

const ProfileProjects = ({ username }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      getProjects(username)
        .then(results => {
          setProjects(results.data);
          setLoading(false);
        })
        .catch(error => toast(error.message));
    }
  }, [username]);

  return !loading && <ProjectList projects={projects} />;
};

export default ProfileProjects;