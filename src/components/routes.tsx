import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingProgress from "./shared/loadingProgress";

const Login = lazy(() => import(/* webpackChunkName: "login" */ "./auth/login"));
const Register = lazy(() => import(/* webpackChunkName: "register" */ "./auth/register"));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ "./dashboard/dashboard"));
const NewProject = lazy(() => import(/* webpackChunkName: "new-project" */ "./project/newProject"));
const Project = lazy(() => import(/* webpackChunkName: "project" */ "./project/project"));
const Settings = lazy(() => import(/* webpackChunkName: "settings" */ "./settings/settings"));
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ "./errors/notFound"));

const AppRoutes = () => (
  <Suspense fallback={<LoadingProgress />}>
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="new" element={<NewProject />} />
      <Route path="settings/*" element={<Settings />} />
      <Route path=":username/:projectName/*" element={<Project />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;