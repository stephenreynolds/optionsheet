import { Link } from "react-router-dom";
import { PLPill } from "../shared/pill";
import { formatPrice, getProfitLoss } from "../../common/tradeUtils";
import StarButton from "./starButton";
import styled from "styled-components";
import { Trade } from "../../common/models/trade";
import { Project } from "../../common/models/project";

const TitleBarDiv = styled.div`
  padding: 1.5rem 40px 0.5rem 40px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  h2 {
    display: inline-block;
    margin-right: 1rem;

    .project-link {
      color: ${props => props.theme.dark.text};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const getNetProfit = (trades: Trade[]): number => {
  if (!trades || trades.length === 0) {
    return NaN;
  }

  const closedTrades = trades.filter((trade) => trade.closeDate);
  const pl = closedTrades.map((trade) => getProfitLoss(trade));

  return Number(pl.reduce((a, b) => a + b, 0));
};

interface Props {
  username: string;
  project: Project;
  trades: Trade[];
}

const TitleBar = ({ username, project, trades }: Props) => {
  const netProfit = getNetProfit(trades);

  return (
    <TitleBarDiv>
      <div>
        <h2 className="m-0">
          <Link to={`/${username}`} className="project-link">
            {username}
          </Link>
          <span> / </span>
          <Link to={`/${username}/${project.name}`} className="project-link">
            {project.name}
          </Link>
        </h2>
        <PLPill value={netProfit.toString()} style={{ marginRight: "0.25rem" }}>
          {formatPrice(netProfit)}
        </PLPill>
      </div>

      <StarButton username={username} projectName={project.name} stars={project.stars} />
    </TitleBarDiv>
  );
};

export default TitleBar;