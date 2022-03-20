import { useEffect, useState } from "react";
import { getStarredProjects } from "../../common/api/user";
import { toast } from "react-toastify";
import ProjectList from "./projectList";

const ProfileStars = ({ username }) => {
  const [starredProjects, setStarredProjects] = useState([]);

  useEffect(() => {
    getStarredProjects(username)
      .then((response) => setStarredProjects(response.data))
      .catch((error) => toast.error(error.message));
  }, []);

  return <ProjectList projects={starredProjects} />;
};

export default ProfileStars;