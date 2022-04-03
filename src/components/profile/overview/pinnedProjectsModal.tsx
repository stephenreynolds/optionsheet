import Modal from "../../shared/modal";
import TextButton from "../../shared/textButton";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { getUsername } from "../../../redux/selectors/userSelectors";
import { useEffect, useState } from "react";
import styled from "styled-components";
import color from "color";
import { getProjects } from "../../../common/api/projects";
import { Project } from "../../../common/models/project";
import { setPinnedProjects as updatePinnedProjects } from "../../../common/api/user";
import { toast } from "react-toastify";

const ProjectListItem = styled.div`
  padding: 0.3em 0.5em;
  border-radius: 5px;
  user-select: none;

  &:hover {
    background-color: ${props => color(props.theme.dark.text).fade(0.85)};
    cursor: pointer;
  }

  input {
    margin: 0 1ch 0 0;
  }

  &.disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  pinnedProjects: Project[];
  setPinnedProjects: (projects: Project[]) => void;
}

const PinnedProjectsModal = ({ show, setShow, pinnedProjects, setPinnedProjects }: Props) => {
  const username = useSelector((state) => getUsername(state));
  const maxPins = 6;

  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (username) {
      getProjects(username).then((res) => {
        const data = res.data
          .filter((project: Project) => !project.pinned)
          .map((project: Project) => {
            return {
              ...project,
              updated_on: new Date(project.updated_on)
            };
          })
          .sort((a, b) => b.updated_on.getTime() - a.updated_on.getTime());
        setProjects([...pinnedProjects, ...data]);
      });
    }
  }, [username]);

  const onFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const onHide = () => {
    setShow(false);
  };

  const onSubmit = () => {
    const projectIds = projects
      .filter((project) => project.pinned)
      .map((project) => project.id);

    updatePinnedProjects(projectIds)
      .then(() => {
        setPinnedProjects(projects.filter((project) => project.pinned));
      })
      .catch((error) => {
        toast.error(error.message);
      });
    onHide();
  };

  const onProjectClick = (project: Project) => {
    setProjects(projects.map((p) => {
      if (pinsRemaining > 0 || (pinsRemaining === 0 && p.pinned)) {
        if (p.name === project.name) {
          p.pinned = !p.pinned;
        }
      }
      return p;
    }));
  };

  if (!show) {
    return null;
  }

  const pinnedCount = projects.reduce((count, project) => {
    return project.pinned ? count + 1 : count;
  }, 0);
  const pinsRemaining = maxPins - pinnedCount;

  return (
    <Modal toggleVisibility={() => false}>
      <div className="modal-heading">
        <div className="d-flex space-between">
          <b>Edit pinned items</b>
          <TextButton onClick={onHide}>
            <FontAwesomeIcon icon={faXmark} />
          </TextButton>
        </div>
      </div>
      <div className="modal-content">
        <div className="muted" style={{ margin: "0.5em 0.5em 1em 0.5em" }}>
          Select up to six projects to pin.
        </div>

        <input type="text" placeholder="Filter projects" onChange={onFilterChange} />

        <div style={{ margin: "1em 0" }}>
          {projects
            .filter((p) => p.pinned || p.name.toLowerCase().includes(filter.toLowerCase()))
            .map((project, i) => (
              <ProjectListItem key={i} onClick={() => onProjectClick(project)}
                               className={pinsRemaining === 0 && !project.pinned ? "disabled" : ""}>
                <input type="checkbox" checked={project.pinned} onChange={() => null}
                       disabled={pinsRemaining === 0 && !project.pinned} />
                <b>{project.name}</b>
              </ProjectListItem>
            ))}
        </div>

        <div className="d-flex space-between align-center">
          <span className={pinsRemaining === 0 ? "text-red" : ""}>
            {pinsRemaining} remaining
          </span>
          <button className="btn-green" onClick={onSubmit}>Save pins</button>
        </div>
      </div>
    </Modal>
  );
};

export default PinnedProjectsModal;