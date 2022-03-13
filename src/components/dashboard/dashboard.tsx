import Sidebar from "./sidebar";
import styled from "styled-components";

const DashboardContainer = styled.div`
  background-color: ${props => props.theme.dark.input.bg};
  display: flex;
  height: 100vh;
`;

const DashboardContent = styled.div`
  padding: 36px;
`;

const Dashboard = () => {
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