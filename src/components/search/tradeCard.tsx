import { Leg } from "../../common/models/trade";
import { getStrategyFromLegs } from "../../common/strategy";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { TagPill } from "../shared/pill";
import { Tag } from "../../common/models/tag";
import moment from "moment";

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

export interface TradeProps {
  id: number;
  symbol: string;
  openDate: Date;
  closeDate?: Date;
  openingNote?: string;
  closingNote?: string;
  legs: Leg[];
  tags: Tag[];
  project: {
    name: string;
    user: {
      username: string;
    }
  };
}

const TradeCard = ({ trade }: { trade: TradeProps }) => {
  if (!(trade && trade.legs && trade.legs.length)) {
    return null;
  }

  const strategy = getStrategyFromLegs(trade.legs);

  return (
    <TradeCardDiv>
      {/* Symbol */}
      <Link to={`/${trade.project.user.username}/${trade.project.name}/${trade.id}`} className="trade-link">
        <h1>{trade.symbol}</h1>
      </Link>

      {/* Link to trade */}
      <Link to={`/${trade.project.user.username}/${trade.project.name}`} className="user-link">
        {trade.project.user.username}/{trade.project.name}
      </Link>

      {/* Strategy */}
      <div>{strategy}</div>

      {/* Tags */}
      <div className="tags">
        {trade.tags.map((tag) => (
          <TagPill key={tag.name}>{tag.name}</TagPill>
        ))}
      </div>

      {/* Notes */}
      <div>
        {trade.closingNote ? (
          <p>
            <b>Closing note:</b><br />
            <span>{trade.closingNote}</span>
          </p>
        ) : (
          <p>
            <b>Opening note:</b><br />
            <span>{trade.openingNote}</span>
          </p>
        )}
      </div>

      {/* Created and closed dates */}
      <div>
        {trade.closeDate ? (
          <small>Closed {moment(new Date(trade.closeDate)).fromNow()}</small>
        ) : (
          <small>Opened {moment(new Date(trade.openDate)).fromNow()}</small>
        )}
      </div>
    </TradeCardDiv>
  );
};

export default TradeCard;