import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { getTradeById } from "../../../../common/api/trades";
import { Trade } from "../../../../common/models/trade";
import { getStrategyFromLegs } from "../../../../common/utils/strategy";
import {
  formatDate,
  formatPrice,
  getMaxLoss,
  getMaxProfit,
  getNetCost,
  getOpenPrice,
  getProfitLoss,
  getReturnOnRisk,
  getTradeDurationDays,
  getTradeQuantity,
  tradeIsOption,
  usd
} from "../../../../common/utils/tradeUtils";
import { PLPill, TagPill } from "../../../../components/pill";
import { getUsername } from "../../../../redux/selectors/userSelectors";
import { Container } from "../../../../styles";
import TradeForm from "../components/tradeForm";
import DeleteTrade from "./components/deleteTrade";
import { DetailsSection } from "./style";

interface Props {
  trades: Trade[];
}

const TradeDetails = ({ trades }: Props) => {
  const myUsername = useSelector((state) => getUsername(state));

  const { username, projectName, id } = useParams<{
    username: string;
    projectName: string;
    id: string;
  }>();
  const [trade, setTrade] = useState<Trade>();
  const [showCloseTrade, setShowCloseTrade] = useState(false);
  const [showEditTrade, setShowEditTrade] = useState(false);
  const [showDeleteTrade, setShowDeleteTrade] = useState(false);

  useEffect(() => {
    getTradeById(id)
      .then((data) => {
        setTrade(data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [id]);

  if (!trade) {
    return null;
  }

  const toggleCloseModal = () => {
    setShowCloseTrade(!showCloseTrade);
  };

  const toggleEditModal = () => {
    setShowEditTrade(!showEditTrade);
  };

  const toggleDeleteModal = () => {
    setShowDeleteTrade(!showDeleteTrade);
  };

  const myProject = username === myUsername;
  const isOption = tradeIsOption(trade.legs);
  const maxProfit = isOption ? getMaxProfit(trade) * 100 : getMaxProfit(trade);
  const maxLoss = isOption ? getMaxLoss(trade) * 100 : getMaxLoss(trade);
  const returnOnRisk = getReturnOnRisk(trade);

  const setUpdatedTrade = (updatedTrade: Partial<Trade>) => {
    setTrade({
      ...trade,
      ...updatedTrade
    });
  };

  return (
    <Container>
      <div className="d-flex space-between">
        <div className="d-flex align-center">
          <div>
            <h1 className="mb-0">{trade.symbol}</h1>
            <h3>{getStrategyFromLegs(trade.legs)}</h3>
            {trade.tags.length > 0 && trade.tags.map((tag, key) => (
              <TagPill key={key}>{tag}</TagPill>
            ))}
          </div>
          <div>
            <PLPill value={getProfitLoss(trade).toString()} className="ml-1">
              {formatPrice(getProfitLoss(trade))}
            </PLPill>
          </div>
        </div>

        {myProject && (
          <div>
            {/* Close trade */}
            {!trade.closeDate && <button onClick={toggleCloseModal} className="ml-0 mr-1">Close trade</button>}

            {/* Edit trade */}
            <button className="ml-0 mr-1" onClick={toggleEditModal}>Edit trade</button>

            {/* Delete trade */}
            <button className="text-red ml-0" onClick={toggleDeleteModal}>Delete trade</button>
          </div>
        )}
      </div>

      <div className="details mb-1" style={{ width: "fit-content", marginRight: "5rem" }}>
        <DetailsSection>
          <p>Open: {formatDate(trade.openDate)}</p>
          {isOption && <p>Expiration: {formatDate(trade.legs[0].expiration)}</p>}
          {trade.closeDate && (
            <>
              <p>Close: {new Date(trade.closeDate).toLocaleDateString()}</p>
              <p>Duration: {getTradeDurationDays(trade)} days</p>
            </>
          )}
        </DetailsSection>

        <DetailsSection>
          <p>Quantity: {getTradeQuantity(trade.legs)}</p>
          <p>Open price: {!isOption ? usd.format(getOpenPrice(trade.legs)) : getOpenPrice(trade.legs).toFixed(2)}</p>
          <p>Net cost: {usd.format(getNetCost(trade.legs) * (isOption ? 100 : 1))}</p>
          {trade.closeDate && <p>P/L: {usd.format(getProfitLoss(trade))}</p>}
        </DetailsSection>

        <DetailsSection>
          <p>Max profit: {isFinite(maxProfit) ? usd.format(maxProfit) : "Unlimited"}</p>
          <p>Max Loss: {!maxLoss ? "Undefined" : isFinite(maxLoss) ? usd.format(maxLoss) : "Unlimited"}</p>
          {isFinite(returnOnRisk) && (
            <p>Return on Risk: {Math.round(returnOnRisk * 100)}%</p>
          )}
        </DetailsSection>

        {(trade.openingNote || trade.closingNote) && (
          <DetailsSection>
            {trade.openingNote && (
              <>
                <b>Opening note:</b>
                <blockquote>{trade.openingNote}</blockquote>
              </>
            )}
            {trade.closingNote && (
              <>
                <b>Closing note:</b>
                <blockquote>{trade.closingNote}</blockquote>
              </>
            )}
          </DetailsSection>
        )}
      </div>

      {myProject && (
        <>
          <TradeForm trade={trade} trades={trades} close={showCloseTrade} show={showCloseTrade || showEditTrade}
                     toggleVisibility={showCloseTrade ? toggleCloseModal : toggleEditModal}
                     setUpdatedTrade={setUpdatedTrade} />
          <DeleteTrade username={username} projectName={projectName} trade={trade} show={showDeleteTrade}
                       toggleVisibility={toggleDeleteModal} />
        </>
      )}
    </Container>
  );
};

export default TradeDetails;