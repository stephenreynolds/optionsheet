import { useSearchParams } from "react-router-dom";
import { lazy } from "react";

const Overview = lazy(() => import(/* webpackChunkName: "profile-overview" */ "./overview"));
const Projects = lazy(() => import(/* webpackChunkName: "profile-projects" */ "./projects"));
const Stars = lazy(() => import(/* webpackChunkName: "profile-stars" */ "./stars"));

const ProfileTab = ({ username }) => {
  const [params] = useSearchParams();

  const currentTab = params.get("tab");

  if (currentTab === "projects") {
    return <Projects username={username} />;
  }

  if (currentTab === "stars") {
    return <Stars username={username} />;
  }

  return <Overview />;
};

export default ProfileTab;