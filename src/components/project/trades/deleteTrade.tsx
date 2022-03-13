import Modal from "../../shared/modal";
import { deleteTradeById, getTrades } from "../../../redux/actions/tradeActions";
import { PromiseDispatch } from "../../../redux/promiseDispatch";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const DeleteTrade = ({username, projectName, trade, show, toggleVisibility}) => {
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
    dispatch(deleteTradeById(trade.id)).then(async () => {
      toast.success("Trade deleted.");
      await dispatch(getTrades(username, projectName));
    }, (error) => {
      toast.error(error.message);
    });
    toggleVisibility();
    navigate(`/${username}/${projectName}`);
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