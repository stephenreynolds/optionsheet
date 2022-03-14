import Sidebar from "./sidebar";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { getIsLoggedIn } from "../../redux/selectors/authSelectors";
import { lazy } from "react";

const Home = lazy(() => import (/* webpackChunkName: "home" */ "../home/home"));

const DashboardContainer = styled.div`
  background-color: ${props => props.theme.dark.input.bg};
  display: flex;
  height: 100vh;
`;

const DashboardContent = styled.div`
  padding: 36px;
`;

const Dashboard = () => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));

  if (!isLoggedIn) {
    return <Home />;
  }

  return (
    <DashboardContainer>
      <Sidebar />
      <DashboardContent>
        <h2>Dashboard</h2>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;