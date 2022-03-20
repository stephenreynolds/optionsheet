import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";
import { Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import * as projectActions from "../../redux/actions/projectActions";
import * as tradeActions from "../../redux/actions/tradeActions";
import { PromiseDispatch } from "../../redux/promiseDispatch";
import { apiCallsInProgress } from "../../redux/selectors/apiSelectors";
import { getProject } from "../../redux/selectors/projectSelectors";
import LoadingProgress from "../shared/loadingProgress";
import { getUsername } from "../../redux/selectors/userSelectors";
import TitleBar from "./titleBar";
import ProjectTabs from "./projectTabs";

const Trades = lazy(() => import(/* webpackChunkName: "project-trades" */ "./trades/trades"));
const TradeDetails = lazy(() => import(/* webpackChunkName: "trade-details" */ "./trades/tradeDetails"));
const Report = lazy(() => import(/* webpackChunkName: "project-report" */ "./analytics/report"));
const Settings = lazy(() => import(/* webpackChunkName: "project-settings" */ "./settings/settings"));

const Project = () => {
  const loading = useSelector((state) => apiCallsInProgress(state));
  const project = useSelector((state) => getProject(state));
  const myUsername = useSelector((state) => getUsername(state));
  const dispatch: PromiseDispatch = useDispatch();

  const { username, projectName } = useParams<{
    username: string;
    projectName: string;
  }>();

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

  const myProject = username === myUsername;

  return (
    <>
      <TitleBar username={username} project={project} />
      <ProjectTabs userIsOwner={myProject} username={username} projectName={projectName} />

      <Suspense fallback={<LoadingProgress />}>
        <Routes>
          <Route>
            <Route index element={<Trades />} />
            <Route path=":id" element={<TradeDetails />} />
            <Route path="*" element={<Navigate to="/notfound" />} />
          </Route>
          <Route path="analytics" element={<Report project={project} loading={loading} />} />
          <Route path="settings" element={myProject ? <Settings username={username} /> : <Navigate to="/notfound" />} />
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Project;