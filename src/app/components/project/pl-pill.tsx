import styled from "styled-components";
import { getProfitLoss, Trade } from "../../common/models/trade";

interface Props {
  trade: Trade;
}

const formatPL = (pl: number, tags?: string[]): string => {
  if (tags && tags.includes("assigned")) {
    return "ASSIGNED";
  }

  if (!pl) {
    return "";
  }

  const prefix = pl >= 0 ? "+" : "-";
  const fixed = Math.abs(pl).toFixed(2);

  return `${prefix} ${fixed}`;
};

const Pill = styled.span`
  font-weight: bold;
  background-color: ${(props) =>
    props.pl === 0
      ? "#343a40"
      : props.pl > 0
      ? "28a745"
      : props < 0
      ? "#dc3545"
      : "none"};
  padding: 0.15rem 0.4rem;
`;

const PLPill = ({ trade }: Props) => {
  const pl = getProfitLoss(trade);
  return <Pill pl={pl}>{formatPL(pl, trade.tags)}</Pill>;
};

export default PLPill;
