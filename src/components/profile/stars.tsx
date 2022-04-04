import { useEffect, useState } from "react";
import { getStarredProjects } from "../../common/api/user";
import { toast } from "react-toastify";
import ProjectList from "./projectList";

interface Props {
  username: string;
}

const ProfileStars = ({ username }: Props) => {
  const [starredProjects, setStarredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStarredProjects(username)
      .then((data) => {
        setStarredProjects(data);
        setLoading(false);
      })
      .catch((error) => toast.error(error.message));
  }, []);

  return !loading && <ProjectList projects={starredProjects} />;
};

export default ProfileStars;