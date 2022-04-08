import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingProgress from "./components/loadingProgress";

const Login = lazy(() => import(/* webpackChunkName: "login" */ "./views/login"));
const Register = lazy(() => import(/* webpackChunkName: "register" */ "./views/register"));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ "./views/dashboard"));
const NewProject = lazy(() => import(/* webpackChunkName: "new-project" */ "./views/project/newProject"));
const Project = lazy(() => import(/* webpackChunkName: "project" */ "./views/project"));
const Settings = lazy(() => import(/* webpackChunkName: "settings" */ "./views/settings"));
const Search = lazy(() => import(/* webpackChunkName: "search" */ "./views/search"));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ "./views/profile"));
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ "./views/errors/notFound"));

const AppRoutes = () => (
  <Suspense fallback={<LoadingProgress />}>
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="new" element={<NewProject />} />
      <Route path="settings/*" element={<Settings />} />
      <Route path="search/*" element={<Search />} />
      <Route path=":username" element={<Profile />} />
      <Route path=":username/:projectName/*" element={<Project />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;