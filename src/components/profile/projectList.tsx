import ProjectCard from "../shared/projectCard";
import { Project } from "../../common/models/project";

interface Props {
  projects: Project[];
}

const ProjectList = ({ projects }: Props) => {
  return (
    <>
      {projects.map((project, key) => (
        <div key={key}>
          <ProjectCard project={project} />
        </div>
      ))}
    </>
  );
};

export default ProjectList;