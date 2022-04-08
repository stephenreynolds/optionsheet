import { useEffect, useState } from "react";
import { getProjects } from "../../../common/api/projects";
import { toast } from "react-toastify";
import ProjectList from "./projectList";
import { Project } from "../../../common/models/project";

interface Props {
  username: string;
}

const ProfileProjects = ({ username }: Props) => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (username) {
      getProjects(username)
        .then((data) => {
          setProjects(data);
          setLoading(false);
        })
        .catch(error => toast(error.message));
    }
  }, [username]);

  return !loading && <ProjectList projects={projects} />;
};

export default ProfileProjects;