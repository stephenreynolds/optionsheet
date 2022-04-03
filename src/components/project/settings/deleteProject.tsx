import Modal from "../../shared/modal";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useState } from "react";
import { deleteProject } from "../../../common/api/projects";

const DeleteProject = ({ username, projectName, show, toggleVisibility }) => {
  const navigate = useNavigate();
  const [confirmInput, setConfirmInput] = useState("");

  if (!show) {
    return null;
  }

  const onConfirmTextChange = (e) => {
    setConfirmInput(e.target.value);
  };

  const onCancel = (e) => {
    e.preventDefault();
    setConfirmInput("");
    toggleVisibility();
  };

  const onSubmit = (e) => {
    e.preventDefault();

    deleteProject(username, projectName)
      .then(() => {
        toast.success("Project deleted.");
        navigate(`/`);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const confirmText = `${username}/${projectName}`;
  const confirmed = confirmInput.toLowerCase() === confirmText.toLowerCase();

  return (
    <Modal toggleVisibility={toggleVisibility}>
      <div className="modal-heading">
        <h3>Close project</h3>
      </div>
      <div className="modal-content">
        Are you sure you want to delete this project?

        <div>
          <p>
            Please type <b>{confirmText}</b> to confirm.
          </p>
          <input type="text" className="m-0 w-100" value={confirmInput} onChange={onConfirmTextChange} />
        </div>

        <div className="form-buttons">
          <button onClick={onCancel} className="ml-0">Cancel</button>
          <button className="btn-red mr-0" onClick={onSubmit} disabled={!confirmed}>Delete</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteProject;