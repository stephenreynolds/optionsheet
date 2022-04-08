import { lazy, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";
import { Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import { getProjectByName } from "../../common/api/projects";
import { getTrades } from "../../common/api/trades";
import { Project as ProjectModel } from "../../common/models/project";
import { Trade } from "../../common/models/trade";
import LoadingProgress from "../../components/loadingProgress";
import { getUsername } from "../../redux/selectors/userSelectors";
import ProjectTabs from "./projectTabs";
import TitleBar from "./titleBar";

const Trades = lazy(() => import(/* webpackChunkName: "project-trades" */ "./trades"));
const TradeDetails = lazy(() => import(/* webpackChunkName: "trade-details" */ "./trades/details"));
const Report = lazy(() => import(/* webpackChunkName: "project-report" */ "./report"));
const Settings = lazy(() => import(/* webpackChunkName: "project-settings" */ "./settings"));

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
    Promise.all([
      getProjectByName(username, projectName)
        .then((data) => setProject(data)),
      getTrades(username, projectName)
        .then((data) => setTrades(data))
    ])
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [projectName, username]);

  if (loading) {
    return null;
  }

  const myProject = username === myUsername;

  return (
    <>
      <TitleBar username={username} project={project} trades={trades} />
      <ProjectTabs userIsOwner={myProject} username={username} projectName={projectName} trades={trades}
                   setTrades={setTrades} />

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