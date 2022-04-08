import { Link } from "react-router-dom";
import { Project } from "../../common/models/project";
import { Trade } from "../../common/models/trade";
import { formatPrice, getProfitLoss } from "../../common/utils/tradeUtils";
import { PLPill } from "../../components/pill";
import StarButton from "./starButton";
import { TitleBarDiv } from "./style";

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