import { lazy, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";
import { Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingProgress from "../shared/loadingProgress";
import { getUsername } from "../../redux/selectors/userSelectors";
import TitleBar from "./titleBar";
import ProjectTabs from "./projectTabs";
import { getProjectByName } from "../../common/api/projects";
import { Project as ProjectModel } from "../../common/models/project";
import { Trade } from "../../common/models/trade";
import { getTrades } from "../../common/api/trades";

const Trades = lazy(() => import(/* webpackChunkName: "project-trades" */ "./trades/trades"));
const TradeDetails = lazy(() => import(/* webpackChunkName: "trade-details" */ "./trades/tradeDetails"));
const Report = lazy(() => import(/* webpackChunkName: "project-report" */ "./report/report"));
const Settings = lazy(() => import(/* webpackChunkName: "project-settings" */ "./settings/settings"));

const Project = () => {
  const myUsername = useSelector((state) => getUsername(state));

  const { username, projectName } = useParams<{
    username: string;
    projectName: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectModel>();
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    try {
      getProjectByName(username, projectName)
        .then(({ data }) => {
          setProject({
            ...data,
            updated_on: new Date(data.updated_on)
          });
        });

      getTrades(username, projectName)
        .then(({ data }) => {
          setTrades(data.map((trade: Trade) => {
            return {
              ...trade,
              open_date: new Date(trade.open_date),
              close_date: trade.close_date ? new Date(trade.close_date) : null,
              created_on: new Date(trade.created_on),
              updated_on: new Date(trade.updated_on),
              legs: trade.legs.map((leg) => {
                return {
                  ...leg,
                  expiration: new Date(leg.expiration)
                };
              })
            };
          }));
        });

      setLoading(false);
    }
    catch (error) {
      toast.error(error.message);
    }
  }, [projectName, username]);

  if (!project) {
    return null;
  }

  const myProject = username === myUsername;

  return (
    <>
      <TitleBar username={username} project={project} trades={trades} />
      <ProjectTabs userIsOwner={myProject} username={username} projectName={projectName} trades={trades} setTrades={setTrades} />

      <Suspense fallback={<LoadingProgress />}>
        <Routes>
          <Route>
            <Route index element={<Trades trades={trades} />} />
            <Route path=":id" element={<TradeDetails trades={trades} />} />
            <Route path="*" element={<Navigate to="/notfound" />} />
          </Route>
          <Route path="analytics" element={<Report project={project} trades={trades} loading={loading} />} />
          <Route path="settings"
                 element={myProject ? <Settings project={project} trades={trades} /> : <Navigate to="/notfound" />} />
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Project;