import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingProgress from "../shared/loadingProgress";
import { Container } from "../styles";
import Sidebar from "./sidebar";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/selectors/authSelectors";
import { useLocation } from "react-router";

const ProfileSettings = lazy(() => import(/* webpackChunkName: "settings-account" */ "./profile"));
const AccountSettings = lazy(() => import(/* webpackChunkName: "settings-account" */ "./account/account"));
const ProjectSettings = lazy(() => import(/* webpackChunkName: "settings-projects" */ "./projects"));

const Settings = () => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={location.pathname} />
  }

  return (
    <Container className="d-flex mt-1">
      <Sidebar />
      <Suspense fallback={<LoadingProgress />}>
        <Routes>
          <Route path="/" element={<Navigate to="profile" />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="projects" element={<ProjectSettings />} />
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
      </Suspense>
    </Container>
  );
};

export default Settings;