import moment from "moment";
import { Link } from "react-router-dom";
import { ProjectSearchProps } from "../../common/models/search";
import { TagPill } from "../pill";
import { ProjectCardDiv } from "./style";

const ProjectCard = ({ project }: { project: ProjectSearchProps }) => {
  if (!(project && project.username)) {
    return null;
  }

  return (
    <ProjectCardDiv>
      {/* Link to project */}
      <Link to={`/${project.username}/${project.name}`} className="project-link">
        {project.username}/{project.name}
      </Link>

      {/* Description */}
      <p>{project.description}</p>

      {/* Tags */}
      <div className="tags">
        {project.tags.map((tag) => (
          <TagPill key={tag}>{tag}</TagPill>
        ))}
      </div>

      {/* Last edited date */}
      <p>
        <small>Last edited {moment(new Date(project.updatedOn)).fromNow()}</small>
      </p>
    </ProjectCardDiv>
  );
};

export default ProjectCard;