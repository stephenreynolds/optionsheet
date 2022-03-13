import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingProgress from "../shared/loadingProgress";
import { Container } from "../styles";
import Sidebar from "./sidebar";

const ProfileSettings = lazy(() => import(/* webpackChunkName: "settings-account" */ "./profile"));
const AccountSettings = lazy(() => import(/* webpackChunkName: "settings-account" */ "./account/account"));
const ProjectSettings = lazy(() => import(/* webpackChunkName: "settings-projects" */ "./projects"));
const TagSettings = lazy(() => import(/* webpackChunkName: "settings-tags" */ "./tags"));

const Settings = () => {
  return (
    <Container className="d-flex mt-1">
      <Sidebar />
      <Suspense fallback={<LoadingProgress />}>
        <Routes>
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="projects" element={<ProjectSettings />} />
          <Route path="tags" element={<TagSettings />} />
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
      </Suspense>
    </Container>
  );
};

export default Settings;