import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Trade } from "../../../common/models/trade";
import TagInput from "../../shared/tagInput";
import { Container } from "../../styles";
import DeleteProject from "./deleteProject";
import { updateProject } from "../../../common/api/projects";
import { Project } from "../../../common/models/project";

const InputGroup = styled.div`
  margin: 1rem 0;

  input {
    width: 250px;

    &[type="checkbox"] {
      width: initial;
      margin-left: 1ch;
      vertical-align: middle;
    }
  }

  input, textarea, button, div {
    margin-left: 0;
  }

  &.bottom-buttons button {
    margin-right: 0.5rem !important;
  }
`;

interface Props {
  project: Project;
  trades: Trade[];
}

const Settings = ({ project, trades }: Props) => {
  const navigate = useNavigate();

  const [newProjectName, setNewProjectName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStartingBalance, setNewStartingBalance] = useState<number | string>("");
  const [newTags, setNewTags] = useState([]);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [newRisk, setNewRisk] = useState<number | string>("");

  useEffect(() => {
    if (project) {
      setNewProjectName(project.name);
      setNewDescription(project.description);
      setNewStartingBalance(project.starting_balance != null ? project.starting_balance : "");
      setNewTags(project.tags);
      setNewRisk(project.risk != null ? project.risk : "");
    }
  }, [project]);

  if (!project) {
    return null;
  }

  const onProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewProjectName(e.target.value);
  };

  const onRename = (e: MouseEvent) => {
    e.preventDefault();

    updateProject(project.username, project.name, { name: newProjectName })
      .then(() => {
        toast.success("Renamed project.");
        navigate(`/${project.username}/${newProjectName}`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewDescription(e.target.value);
  };

  const onUpdateDescription = (e: MouseEvent) => {
    e.preventDefault();

    updateProject(project.username, project.name, { description: newDescription })
      .then(() => {
        toast.success("Updated description.");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onStartingBalanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewStartingBalance(e.target.value);
  };

  const onUpdateStartingBalance = (e: MouseEvent) => {
    e.preventDefault();

    const startingBalance = newStartingBalance === "" ? null : Number(newStartingBalance);

    updateProject(project.username, project.name, { starting_balance: startingBalance })
      .then(() => {
        toast.success("Updated starting balance.");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onRiskChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewRisk(e.target.value);
  };

  const onUpdateRisk = (e: MouseEvent) => {
    e.preventDefault();

    const risk = newRisk === "" ? null : Number(newRisk);

    updateProject(project.username, project.name, { risk })
      .then(() => {
        toast.success("Updated risk %.");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onTagsChange = (tags: string[]) => {
    setNewTags(tags);
  };

  const onUpdateTags = (e: MouseEvent) => {
    e.preventDefault();

    updateProject(project.username, project.name, { tags: newTags })
      .then(() => {
        toast.success("Updated tags.");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const toggleShowDeleteProject = () => {
    setShowDeleteProject(!showDeleteProject);
  };

  const exportProject = () => {
    const exportedProject = { ...project, trades };
    const json = JSON.stringify(exportedProject, null, 2);

    const a = document.createElement("a");
    a.href = `data:application/json;charset=utf-8,${json}`;
    a.download = `${project.name}.json`;
    a.click();
  };

  return (
    <Container>
      {/* Name */}
      <InputGroup>
        <label>Project name</label>
        <input type="text" value={newProjectName} onChange={onProjectNameChange} />
        <button onClick={onRename}>Rename</button>
      </InputGroup>

      {/* Description */}
      <InputGroup>
        <label>Project description</label>
        <textarea rows={4} value={newDescription} onChange={onDescriptionChange} />
        <button onClick={onUpdateDescription}>Update description</button>
      </InputGroup>

      {/* Starting balance */}
      <InputGroup>
        <label>Starting balance</label>
        <input
          type="number"
          name="startingBalance"
          placeholder="Enter an amount..."
          min="0"
          step="0.01"
          value={newStartingBalance}
          onChange={onStartingBalanceChange}
        />
        <button onClick={onUpdateStartingBalance}>Change</button>
      </InputGroup>

      {/* Risk % */}
      <InputGroup>
        <label>Risk %</label>
        <input
          type="number"
          name="risk"
          placeholder="Enter an amount..."
          min="0"
          step="0.01"
          value={newRisk}
          onChange={onRiskChange}
        />
        <button onClick={onUpdateRisk}>Change</button>
      </InputGroup>

      {/* Tags */}
      <InputGroup>
        <label>Tags</label>
        <TagInput tags={newTags} setTags={onTagsChange} />
        <button onClick={onUpdateTags}>Update tags</button>
      </InputGroup>

      {/* Export and delete project */}
      <InputGroup className="bottom-buttons">
        <button onClick={exportProject}>Export Project</button>
        <button className="text-red" onClick={toggleShowDeleteProject}>Delete project</button>
      </InputGroup>

      <DeleteProject username={project.username} projectName={project.name}
                     show={showDeleteProject} toggleVisibility={toggleShowDeleteProject} />
    </Container>
  );
};

export default Settings;