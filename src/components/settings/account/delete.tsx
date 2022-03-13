import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { deleteUser } from "../../../redux/actions/userActions";
import { PromiseDispatch } from "../../../redux/promiseDispatch";
import { getUsername } from "../../../redux/selectors/userSelectors";
import Modal from "../../shared/modal";

const DeleteAccount = ({ show, toggleVisibility }) => {
  const username = useSelector((state) => getUsername(state));
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

    dispatch(deleteUser(username))
      .then(() => {
        navigate("/");
        toggleVisibility();
      })
      .catch((error) => {
        toast.error(error.message);
      });

    toggleVisibility();
  };

  return (
    <Modal toggleVisibility={toggleVisibility}>
      <div className="modal-heading">
        <h3>Delete account</h3>
      </div>
      <div className="modal-content">
        Are you sure you want to delete your account?

        <div className="form-buttons">
          <button onClick={onCancel} className="ml-0">Cancel</button>
          <button className="btn-red mr-0" onClick={onSubmit}>Delete account</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccount;