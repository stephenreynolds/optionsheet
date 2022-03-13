import { faChartLine, faGear, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { formatPrice } from "../../common/tradeUtils";
import * as projectActions from "../../redux/actions/projectActions";
import * as tradeActions from "../../redux/actions/tradeActions";
import { PromiseDispatch } from "../../redux/promiseDispatch";
import { apiCallsInProgress } from "../../redux/selectors/apiSelectors";
import { getProject } from "../../redux/selectors/projectSelectors";
import { getNetProfit } from "../../redux/selectors/tradeSelectors";
import LoadingProgress from "../shared/loadingProgress";
import { PLPill, TagPill } from "../shared/pill";
import TradeForm from "./trades/tradeForm";

const Trades = lazy(() => import(/* webpackChunkName: "project-trades" */ "./trades/trades"));
const TradeDetails = lazy(() => import(/* webpackChunkName: "trade-details" */ "./trades/tradeDetails"));
const Report = lazy(() => import(/* webpackChunkName: "project-report" */ "./analytics/report"));
const Settings = lazy(() => import(/* webpackChunkName: "project-settings" */ "./settings/settings"));

const TitleBar = styled.div`
  padding: 1.5rem 1.5rem 1.5rem 40px;
  display: flex;
  align-items: baseline;

  .project-link {
    color: ${props => props.theme.dark.text};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .tags {
    margin-left: 1rem;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 0.5em;
  color: ${props => props.theme.dark.borderLight};
  font-size: 1.1em;
`;

const PageTabs = styled.nav`
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

const Project = () => {
  const loading = useSelector((state) => apiCallsInProgress(state));
  const project = useSelector((state) => getProject(state));
  const netProfit = useSelector((state) => getNetProfit(state));
  const dispatch: PromiseDispatch = useDispatch();

  const { username, projectName } = useParams<{
    username: string;
    projectName: string;
  }>();

  const [showNewTradeModel, setShowNewTradeModel] = useState(false);

  useEffect(() => {
    try {
      dispatch(projectActions.getProject(username, projectName))
        .catch((error) => {
          toast.error(error.message);
        });
      dispatch(tradeActions.getTrades(username, projectName))
        .catch((error) => {
          toast.error(error.message);
        });
    }
    catch (error) {
      toast.error(error.message);
    }
  }, [dispatch, projectName, username]);

  if (!project) {
    return null;
  }

  const toggleShowNewTradeModel = () => {
    setShowNewTradeModel(!showNewTradeModel);
  };

  return (
    <>
      <TitleBar>
        <Link to={`/${username}/${projectName}`} className="project-link">
          <h2 className="m-0">{project.name}</h2>
        </Link>
        <div className="tags">
          <PLPill value={netProfit.toString()} style={{marginRight: "0.25rem"}}>
            {formatPrice(netProfit)}
          </PLPill>

          {project.tags.map((tag) => (
            <TagPill key={tag}>{tag}</TagPill>
          ))}
        </div>
      </TitleBar>

      <PageTabs>
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
          <li>
            <NavLink to="settings" className={activeClassName}>
              <StyledIcon icon={faGear} />
              <span data-content="Settings">Settings</span>
            </NavLink>
          </li>
          <li>
            <button className="btn-green m-0" onClick={toggleShowNewTradeModel}>New trade</button>
          </li>
        </ul>
      </PageTabs>

      <TradeForm username={username} projectName={projectName}
                show={showNewTradeModel} toggleVisibility={toggleShowNewTradeModel} />

      <Suspense fallback={<LoadingProgress />}>
        <Routes>
          <Route>
            <Route index element={<Trades />} />
            <Route path=":id" element={<TradeDetails />} />
            <Route path="*" element={<Navigate to="/notfound" />} />
          </Route>
          <Route path="analytics" element={<Report project={project} loading={loading} />} />
          <Route path="settings" element={<Settings username={username} />} />
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Project;