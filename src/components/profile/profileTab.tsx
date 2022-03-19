import { useSearchParams } from "react-router-dom";
import { lazy } from "react";

const Overview = lazy(() => import(/* webpackChunkName: "profile-overview" */ "./overview"));
const Projects = lazy(() => import(/* webpackChunkName: "profile-projects" */ "./projects"));
const Stars = lazy(() => import(/* webpackChunkName: "profile-stars" */ "./stars"));

const ProfileTab = ({ user }) => {
  const [params] = useSearchParams();

  const currentTab = params.get("tab");


  if (currentTab === "projects") {
    return <Projects user={user} />;
  }

  if (currentTab === "stars") {
    return <Stars />;
  }

  return <Overview />;
};

export default ProfileTab;