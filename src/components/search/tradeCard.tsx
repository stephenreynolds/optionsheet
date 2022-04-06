import { getStrategyFromLegs } from "../../common/strategy";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { TagPill } from "../shared/pill";
import moment from "moment";
import { TradeSearchProps } from "../../common/models/search";

const TradeCardDiv = styled.div`
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 1rem 1rem 1rem 0;
  border-top: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
  transition: background-color 0.2s ease;

  &:first-child {
    margin-top: 0;
  }

  a.trade-link {
    color: ${props => props.theme.dark.text};

    h1 {
      margin-bottom: 0;
      font-weight: 600;
    }
  }

  .user-link {
    font-size: 16px;
  }

  .tags {
    margin-top: 1rem;
  }
`;

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