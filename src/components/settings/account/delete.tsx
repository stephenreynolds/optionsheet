import { useNavigate } from "react-router";
import { MouseEvent } from "react";
import { toast } from "react-toastify";
import Modal from "../../shared/modal";
import { deleteUser } from "../../../common/api/user";

interface Props {
  show: boolean;
  toggleVisibility: () => void;
}

const DeleteAccount = ({ show, toggleVisibility }: Props) => {
  const navigate = useNavigate();

  if (!show) {
    return null;
  }

  const onCancel = (e: MouseEvent) => {
    e.preventDefault();
    toggleVisibility();
  };

  const onSubmit = (e: MouseEvent) => {
    e.preventDefault();

    deleteUser()
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