import { useEffect, useState } from "react";
import { getStarredProjects } from "../../common/api/user";
import { toast } from "react-toastify";
import ProjectList from "./projectList";

const ProfileStars = ({ username }) => {
  const [starredProjects, setStarredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStarredProjects(username)
      .then((response) => {
        setStarredProjects(response.data);
        setLoading(false);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  return !loading && <ProjectList projects={starredProjects} />;
};

export default ProfileStars;