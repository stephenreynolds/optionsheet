import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { Leg, Trade } from "../../../common/models/trade";
import { getStrategyFromLegs } from "../../../common/strategy";
import {
  formatDate,
  formatPrice,
  getFirstExpiration,
  getNetCost,
  getOpenPrice,
  getProfitLoss,
  getTradeQuantity,
  tradeIsOption
} from "../../../common/tradeUtils";
import { getTrades } from "../../../redux/selectors/tradeSelectors";
import { PLPill, TagPill } from "../../shared/pill";
import { Container } from "../../styles";
import { PageSizeSelect, Pagination } from "../../shared/pagination";

const Table = styled.table`
  width: 100%;
  border: 1px solid ${props => props.theme.dark.border};
  border-spacing: 0;
  border-radius: 6px;
  background-color: ${props => props.theme.dark.fg};

  th {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-right: 0;
    background-color: #1d232c;
    text-align: center;
    user-select: none;

    &:hover {
      cursor: pointer;
    }
  }

  tbody {
    tr {
      &:hover {
        background-color: #40464f;
        cursor: pointer;
      }

      td {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        border-top: 1px solid ${props => props.theme.dark.border};
        text-align: center;
      }

      &:last-child {
        td:first-child {
          border-bottom-left-radius: 6px;
        }

        td:last-child {
          border-bottom-right-radius: 6px;
        }
      }
    }
  }

  .left-align {
    text-align: left;
  }
`;

enum SortDirection {
  Ascending,
  Descending
}

const sortTrades = (trades: Trade[], { property, direction }) => {
  return trades.sort((a, b) => {
    if (property === "openDate" || property === "closeDate") {
      const aValue = !a[property] ? -1 : a[property].getTime();
      const bValue = !b[property] ? -1 : b[property].getTime();
      return direction === SortDirection.Descending ? bValue - aValue : aValue - bValue;
    }
    if (property === "expiration") {
      const aValue = getFirstExpiration(a.legs).getTime();
      const bValue = getFirstExpiration(b.legs).getTime();
      return direction === SortDirection.Descending ? bValue - aValue : aValue - bValue;
    }
    if (property === "quantity") {
      const aValue = getTradeQuantity(a.legs);
      const bValue = getTradeQuantity(b.legs);
      return direction === SortDirection.Descending ? bValue - aValue : aValue - bValue;
    }
    if (property === "cost") {
      const aValue = getOpenPrice(a.legs);
      const bValue = getOpenPrice(b.legs);
      return direction === SortDirection.Descending ? bValue - aValue : aValue - bValue;
    }
    if (property === "pl") {
      const aValue = getProfitLoss(a);
      const bValue = getProfitLoss(b);
      return direction === SortDirection.Descending ? bValue - aValue : aValue - bValue;
    }
    if (property === "symbol" || property === "strategy") {
      const aValue = property === "symbol" ? a.symbol : getStrategyFromLegs(a.legs);
      const bValue = property === "symbol" ? b.symbol : getStrategyFromLegs(b.legs);

      if (direction === SortDirection.Descending) {
        if (aValue < bValue) {
          return -1;
        }
        else if (aValue > bValue) {
          return 1;
        }
      }
      else if (direction === SortDirection.Ascending) {
        if (aValue > bValue) {
          return -1;
        }
        else if (aValue < bValue) {
          return 1;
        }
      }
      return 0;
    }
  });
};

const toggleSortDirection = (direction: SortDirection) => {
  return direction === SortDirection.Descending ? SortDirection.Ascending : SortDirection.Descending;
};

const SortIcon = ({ sortMethod }) => <FontAwesomeIcon
  icon={sortMethod.direction === SortDirection.Ascending ? faCaretUp : faCaretDown} />;

const Trades = () => {
  const trades = useSelector((state) => getTrades(state));
  const navigate = useNavigate();

  const [sortMethod, setSortMethod] = useState({ property: "openDate", direction: SortDirection.Descending });
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(50);

  if (!trades) {
    return null;
  }

  const onTradeClick = (trade: Trade) => {
    navigate(`${trade.id}`);
  };

  const sortBy = (property: string) => {
    setSortMethod({
      property,
      direction: toggleSortDirection(sortMethod.direction)
    });
  };

  const getTradeExpiration = (legs: Leg[]) => {
    if (tradeIsOption(legs)) {
      return getFirstExpiration(legs);
    }

    return undefined;
  };

  const getTradeCost = (legs: Leg[]) => {
    const cost = getNetCost(legs);

    if (tradeIsOption(legs)) {
      return cost * 100;
    }

    return cost;
  };

  return (
    <Container>
      <div style={{
        marginTop: "-2rem",
        marginBottom: "0.5rem",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        justifyItems: "center"
      }}>
        <div style={{ gridColumnStart: 2 }}>
          <Pagination count={count} index={index} setIndex={setIndex} max={trades.length} />
        </div>
        <div style={{ marginLeft: "auto" }}>
          <PageSizeSelect currentCount={count} max={trades.length}
                          options={[25, 50, 100, 200, 500, 1000, trades.length]} setCount={setCount} />
        </div>
      </div>

      <Table>
        <thead>
        <tr>
          <th onClick={() => sortBy("openDate")}>Open {sortMethod.property === "openDate" &&
            <SortIcon sortMethod={sortMethod} />}</th>
          <th onClick={() => sortBy("closeDate")}>Close {sortMethod.property === "closeDate" &&
            <SortIcon sortMethod={sortMethod} />}</th>
          <th onClick={() => sortBy("expiration")}>Exp. {sortMethod.property === "expiration" &&
            <SortIcon sortMethod={sortMethod} />}</th>
          <th onClick={() => sortBy("symbol")}>Symbol {sortMethod.property === "symbol" &&
            <SortIcon sortMethod={sortMethod} />}</th>
          <th onClick={() => sortBy("quantity")}>Qty. {sortMethod.property === "quantity" &&
            <SortIcon sortMethod={sortMethod} />}</th>
          <th onClick={() => sortBy("strategy")}>Strategy {sortMethod.property === "strategy" &&
            <SortIcon sortMethod={sortMethod} />}</th>
          <th onClick={() => sortBy("cost")}>Cost {sortMethod.property === "cost" &&
            <SortIcon sortMethod={sortMethod} />}</th>
          <th onClick={() => sortBy("pl")}>P/L {sortMethod.property === "pl" &&
            <SortIcon sortMethod={sortMethod} />}</th>
          <th className="left-align">Tags</th>
        </tr>
        </thead>
        <tbody>
        {sortTrades(trades.slice(), sortMethod)
          .slice(index, index + count)
          .map((trade: Trade, i) => (
            <tr key={i} onClick={() => onTradeClick(trade)}>
              {/* Open date */}
              <td>{formatDate(trade.openDate)}</td>
              {/* Close date */}
              <td>{trade.closeDate ? formatDate(trade.closeDate) : null}</td>
              {/* Expiration */}
              <td>{formatDate(getTradeExpiration(trade.legs))}</td>
              {/* Symbol */}
              <td>{trade.symbol.toUpperCase()}</td>
              {/* Quantity */}
              <td>{getTradeQuantity(trade.legs)}</td>
              {/* Strategy */}
              <td>{getStrategyFromLegs(trade.legs)}</td>
              {/* Cost */}
              <td>{formatPrice(getTradeCost(trade.legs))}</td>
              {/* P/L */}
              <td>
                <PLPill value={getProfitLoss(trade).toString()}>
                  {formatPrice(getProfitLoss(trade))}
                </PLPill>
              </td>
              <td className="left-align">
                {trade.tags.map((tag) => (
                  <TagPill key={tag} value={tag}>{tag}</TagPill>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div style={{ margin: "0 auto", marginTop: "0.5rem", width: "fit-content" }}>
        <Pagination count={count} index={index} setIndex={setIndex} max={trades.length} />
      </div>
    </Container>
  );
};

export default Trades;