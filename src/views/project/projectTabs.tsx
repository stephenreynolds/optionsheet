import { faChartLine, faGear, faList } from "@fortawesome/free-solid-svg-icons";
import { lazy, ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { Trade, TradeCreateModel } from "../../common/models/trade";
import { StyledIcon, TabNav } from "./style";

const TradeForm = lazy(() => import(/* webpackChunkName: "trade-form" */ "./trades/components/tradeForm"));

const activeClassName = ({ isActive }) => isActive ? "selected" : undefined;

interface Props {
  userIsOwner: boolean;
  username: string;
  projectName: string;
  trades: Trade[];
  setTrades: (trades: Trade[]) => void;
}

const ProjectTabs = ({ userIsOwner, username, projectName, trades, setTrades }: Props) => {
  const [showNewTradeModel, setShowNewTradeModel] = useState(false);

  const toggleShowNewTradeModel = () => {
    setShowNewTradeModel(!showNewTradeModel);
  };

  const setUpdatedTrade = (newTrade: TradeCreateModel) => {
    setTrades([
      ...trades,
      {
        ...newTrade,
        createdOn: new Date(),
        updatedOn: new Date()
      }
    ]);
  };

  const renderIfOwner = (children: ReactNode) => {
    return userIsOwner ? children : null;
  };

  return (
    <TabNav>
      <ul>
        <li>
          <NavLink to="" className={activeClassName} end>
            <StyledIcon icon={faList} />
            <span data-content="Trades">Trades</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="analytics" className={activeClassName}>
            <StyledIcon icon={faChartLine} />
            <span data-content="Report">Report</span>
          </NavLink>
        </li>
        {renderIfOwner(
          <>
            <li>
              <NavLink to="settings" className={activeClassName}>
                <StyledIcon icon={faGear} />
                <span data-content="Settings">Settings</span>
              </NavLink>
            </li>
            <li>
              <button className="new-trade-btn btn-green m-0" onClick={toggleShowNewTradeModel}>New trade</button>
              <TradeForm username={username} projectName={projectName} trades={trades}
                         show={showNewTradeModel} toggleVisibility={toggleShowNewTradeModel}
                         setUpdatedTrade={setUpdatedTrade} />
            </li>
          </>
        )}
      </ul>
    </TabNav>
  );
};

export default ProjectTabs;