import { lazy } from "react";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/selectors/userSelectors";
import Sidebar from "./components/sidebar";
import { DashboardContainer } from "./style";

const Home = lazy(() => import (/* webpackChunkName: "home" */ "../home"));

const Index = () => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));

  if (!isLoggedIn) {
    return <Home />;
  }

  return (
    <DashboardContainer>
      <Sidebar />
      <div className="dashboard-content">
        <h2>Dashboard</h2>
      </div>
    </DashboardContainer>
  );
};

export default Index;