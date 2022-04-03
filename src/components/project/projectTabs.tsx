import { NavLink } from "react-router-dom";
import { faChartLine, faGear, faList } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lazy, useState } from "react";
import { Trade } from "../../common/models/trade";

const TradeForm = lazy(() => import(/* webpackChunkName: "trade-form" */ "./trades/tradeForm"));

const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 0.5em;
  color: ${props => props.theme.dark.borderLight};
  font-size: 1.1em;
`;

const TabNav = styled.nav`
  box-shadow: inset 0 -1px 0 ${props => props.theme.dark.border};
  padding: 0 32px;
  margin-bottom: 32px;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;

    li {
      a {
        padding: 1rem;
        color: ${props => props.theme.dark.text};
        text-decoration: none;
        transition: box-shadow 0.12s ease-out;
        display: inline-flex;

        &:hover {
          cursor: pointer;
          box-shadow: inset 0 -2px 0 ${props => props.theme.dark.borderLight};
        }

        [data-content] {
          &::before {
            content: attr(data-content);
            font-weight: 600;
            display: block;
            height: 0;
            visibility: hidden;
          }
        }

        &.selected {
          box-shadow: inset 0 -2px 0 ${props => props.theme.dark.accent};
          font-weight: 600;

          ${StyledIcon} {
            color: ${props => props.theme.dark.text}
          }
        }
      }
    }

    button {
      margin-left: 1rem;
    }
  }
`;

const activeClassName = ({ isActive }) => isActive ? "selected" : undefined;

interface Props {
  userIsOwner: boolean;
  username: string;
  projectName: string;
  trades: Trade[];
}

const ProjectTabs = ({ userIsOwner, username, projectName, trades }: Props) => {
  const [showNewTradeModel, setShowNewTradeModel] = useState(false);

  const toggleShowNewTradeModel = () => {
    setShowNewTradeModel(!showNewTradeModel);
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
        {userIsOwner && (
          <li>
            <NavLink to="settings" className={activeClassName}>
              <StyledIcon icon={faGear} />
              <span data-content="Settings">Settings</span>
            </NavLink>
          </li>
        )}
        {userIsOwner && (
          <li>
            <button className="btn-green m-0" onClick={toggleShowNewTradeModel}>New trade</button>
          </li>
        )}
      </ul>

      {userIsOwner && (
        <TradeForm username={username} projectName={projectName} trades={trades}
                   show={showNewTradeModel} toggleVisibility={toggleShowNewTradeModel} />
      )}
    </TabNav>
  );
};

export default ProjectTabs;