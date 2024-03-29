import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingProgress from "../../components/loadingProgress";
import { Container } from "../../styles";
import Sidebar from "./components/sidebar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getIsLoggedIn } from "../../redux/selectors/userSelectors";

const ProfileSettings = lazy(() => import(/* webpackChunkName: "settings-account" */ "./profile"));
const AccountSettings = lazy(() => import(/* webpackChunkName: "settings-account" */ "./account"));
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