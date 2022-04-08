import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getProjects } from "../../../../common/api/projects";
import { setPinnedProjects as updatePinnedProjects } from "../../../../common/api/user";
import { Project } from "../../../../common/models/project";
import { getUsername } from "../../../../redux/selectors/userSelectors";
import Modal from "../../../../components/modal";
import TextButton from "../../../../components/textButton";
import { ProjectListItem } from "../style";

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
      getProjects(username).then((data) => {
        const unpinned = data
          .filter((project: Project) => !project.pinned)
          .sort((a, b) => b.updatedOn.getTime() - a.updatedOn.getTime());
        setProjects([...pinnedProjects, ...unpinned]);
      });
    }
  }, [username]);

  const onFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
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