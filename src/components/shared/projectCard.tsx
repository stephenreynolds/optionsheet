import styled from "styled-components";
import { Link } from "react-router-dom";
import { TagPill } from "./pill";
import moment from "moment";
import { ProjectSearchProps } from "../../common/models/search";

const ProjectCardDiv = styled.div`
  margin: 0.5rem 0.5rem 1.5rem 0;
  padding: 1rem 1rem 0 0;
  border-top: 1px solid ${props => props.theme.dark.border};
  transition: background-color 0.2s ease;

  &:first-child {
    margin-top: 0;
  }

  a.trade-link {
    color: ${props => props.theme.dark.text};
    
    h1 {
      margin-bottom: 0;
      font-weight: 600;
    }
  }

  .project-link {
    font-size: 16px;
  }

  .tags {
    margin-top: 1rem;
  }
`;

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