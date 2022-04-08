import moment from "moment";
import { Link } from "react-router-dom";
import { TradeSearchProps } from "../../../common/models/search";
import { getStrategyFromLegs } from "../../../common/utils/strategy";
import { TagPill } from "../../../components/pill";
import { TradeCardDiv } from "../style";

const TradeCard = ({ trade }: { trade: TradeSearchProps }) => {
  if (!(trade && trade.legs && trade.legs.length)) {
    return null;
  }

  const strategy = getStrategyFromLegs(trade.legs);

  return (
    <TradeCardDiv>
      {/* Symbol */}
      <Link to={`/${trade.username}/${trade.projectName}/${trade.id}`} className="trade-link">
        <h1>{trade.symbol}</h1>
      </Link>

      {/* Link to trade */}
      <Link to={`/${trade.username}/${trade.projectName}`} className="user-link">
        {trade.username}/{trade.projectName}
      </Link>

      {/* Strategy */}
      <div>{strategy}</div>

      {/* Tags */}
      <div className="tags">
        {trade.tags.map((tag) => (
          <TagPill key={tag}>{tag}</TagPill>
        ))}
      </div>

      {/* Notes */}
      <div>
        {trade.closingNote ? (
          <p>
            <b>Closing note:</b><br />
            <span>{trade.closingNote}</span>
          </p>
        ) : trade.closingNote && (
          <p>
            <b>Opening note:</b><br />
            <span>{trade.openingNote}</span>
          </p>
        )}
      </div>

      {/* Created and closed dates */}
      <div>
        {trade.closeDate ? (
          <small>Closed {moment(trade.closeDate).fromNow()}</small>
        ) : (
          <small>Opened {moment(trade.openDate).fromNow()}</small>
        )}
      </div>
    </TradeCardDiv>
  );
};

export default TradeCard;