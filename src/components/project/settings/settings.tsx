import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Project } from "../../../common/models/project";
import { Trade } from "../../../common/models/trade";
import { updateProject } from "../../../redux/actions/projectActions";
import { PromiseDispatch } from "../../../redux/promiseDispatch";
import { getProject } from "../../../redux/selectors/projectSelectors";
import { getTrades } from "../../../redux/selectors/tradeSelectors";
import TagInput from "../../shared/tagInput";
import { Container } from "../../styles";
import DeleteProject from "./deleteProject";

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

const Settings = ({ username }) => {
  const dispatch: PromiseDispatch = useDispatch();
  const navigate = useNavigate();
  const project: Project = useSelector((state) => getProject(state));
  const trades: Trade[] = useSelector((state) => getTrades(state));

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

  const onProjectNameChange = (e) => {
    setNewProjectName(e.target.value);
  };

  const onRename = (e) => {
    e.preventDefault();

    dispatch(updateProject(username, project.name, { name: newProjectName })).then(() => {
      toast.success("Renamed project.");
      navigate(`/${username}/${newProjectName}`);
    }, (error) => {
      toast.error(error.message);
    });
  };

  const onDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };

  const onUpdateDescription = (e) => {
    e.preventDefault();

    dispatch(updateProject(username, project.name, { description: newDescription })).then(() => {
      toast.success("Updated description.");
    }, (error) => {
      toast.error(error);
    });
  };

  const onStartingBalanceChange = (e) => {
    setNewStartingBalance(e.target.value);
  };

  const onUpdateStartingBalance = (e) => {
    e.preventDefault();

    const startingBalance = newStartingBalance === "" ? null : Number(newStartingBalance);

    dispatch(updateProject(username, project.name, { starting_balance: startingBalance })).then(() => {
      toast.success("Updated starting balance.");
    }, (error) => {
      toast.error(error);
    });
  };

  const onRiskChange = (e) => {
    setNewRisk(e.target.value);
  };

  const onUpdateRisk = (e) => {
    e.preventDefault();

    const risk = newRisk === "" ? null : Number(newRisk);

    dispatch(updateProject(username, project.name, { risk })).then(() => {
      toast.success("Updated risk %.");
    }, (error) => {
      toast.error(error);
    });
  };

  const onTagsChange = (tags) => {
    setNewTags(tags);
  };

  const onUpdateTags = (e) => {
    e.preventDefault();

    dispatch(updateProject(username, project.name, { tags: newTags })).then(() => {
      toast.success("Updated tags.");
    }, (error) => {
      toast.error(error);
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

      <DeleteProject username={username} projectName={project.name}
                     show={showDeleteProject} toggleVisibility={toggleShowDeleteProject} />
    </Container>
  );
};

export default Settings;