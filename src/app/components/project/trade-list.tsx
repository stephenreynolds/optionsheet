import styled from "styled-components";
import { Leg, tradeTypeString } from "../../common/models/trade";
import { TagPill } from "./styles";
import PLPill from "./pl-pill";

const TradeTable = styled.table`
  width: 100%;

  tr {
    user-select: none;

    &:hover {
      background-color: grey;
      cursor: pointer;

      &:first-child {
        background-color: initial;
        cursor: initial;
      }
    }

    td,
    th {
      padding-left: 13px;
      padding-right: 13px;
    }
  }
`;

const getLegExpirations = (legs: Leg[]): Date[] => {
  return legs.map((l) => new Date(l.expiration));
};

const getEarliestDate = (dates: Date[]): Date => {
  return dates.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  })[0];
};

const TradeList = ({ project }) => {
  return (
    <>
      <TradeTable>
        <tbody>
          <tr>
            <th>Open</th>
            <th>Exp</th>
            <th>Symbol</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Strike</th>
            <th>P/L</th>
            <th>Tags</th>
          </tr>
          {!project.trades || project.trades.length === 0 ? (
            <tr>
              <td>Empty.</td>
            </tr>
          ) : (
            project.trades.map((trade, i) => (
              <tr key={i}>
                <td>{new Date(trade.open).toLocaleDateString()}</td>
                <td>
                  {getEarliestDate(
                    getLegExpirations(trade.legs)
                  ).toLocaleDateString()}
                </td>
                <td>{trade.symbol}</td>
                <td>{tradeTypeString(trade.type)}</td>
                <td>{trade.quantity}</td>
                <td>
                  {trade.legs.map((leg, i, a) =>
                    i < a.length - 1 ? `${leg.strike}/` : leg.strike
                  )}
                </td>
                <td>
                  <PLPill trade={trade} />
                </td>
                <td>
                  {trade.tags.map((tag) => (
                    <TagPill key="tag">{tag}</TagPill>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </TradeTable>
    </>
  );
};

export default TradeList;
