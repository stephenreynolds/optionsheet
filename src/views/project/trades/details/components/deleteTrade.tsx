import Modal from "../../../../../components/modal";
import { useNavigate } from "react-router";
import { MouseEvent } from "react";
import { toast } from "react-toastify";
import { deleteTradeById } from "../../../../../common/api/trades";
import { Trade } from "../../../../../common/models/trade";

interface Props {
  username: string;
  projectName: string;
  trade: Trade;
  show: boolean;
  toggleVisibility: () => void;
}

const DeleteTrade = ({ username, projectName, trade, show, toggleVisibility }: Props) => {
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

    deleteTradeById(trade.id)
      .then(async () => {
        toast.success("Trade deleted.");
        navigate(`/${username}/${projectName}`);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        toggleVisibility();
      });
  };

  return (
    <Modal toggleVisibility={toggleVisibility}>
      <div className="modal-heading">
        <h3>Close trade</h3>
      </div>
      <div className="modal-content">
        Are you sure you want to delete this trade?

        <div className="form-buttons">
          <button onClick={onCancel} className="ml-0">Cancel</button>
          <button className="btn-red mr-0" onClick={onSubmit}>Delete</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTrade;