import Modal from "../../shared/modal";
import { deleteProject } from "../../../redux/actions/projectActions";
import { PromiseDispatch } from "../../../redux/promiseDispatch";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const DeleteProject = ({ username, projectName, show, toggleVisibility }) => {
  const dispatch: PromiseDispatch = useDispatch();
  const navigate = useNavigate();

  if (!show) {
    return null;
  }

  const onCancel = (e) => {
    e.preventDefault();
    toggleVisibility();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(deleteProject(username, projectName)).then(() => {
      toast.success("Project deleted.");
      navigate(`/`);
    }, (error) => {
      toast.error(error.message);
    });
  };

  return (
    <Modal toggleVisibility={toggleVisibility}>
      <div className="modal-heading">
        <h3>Close project</h3>
      </div>
      <div className="modal-content">
        Are you sure you want to delete this project?

        <div className="form-buttons">
          <button onClick={onCancel} className="ml-0">Cancel</button>
          <button className="btn-red mr-0" onClick={onSubmit}>Delete</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteProject;