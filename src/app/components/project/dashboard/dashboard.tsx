import Sidebar from "./sidebar/sidebar";
import { DashboardContainer } from "./dashboard.styles";

const Dashboard = (): JSX.Element => {
  return (
    <DashboardContainer fluid className="row">
      <Sidebar />
      <div className="col-10">
        <h1>Dashboard</h1>
      </div>
    </DashboardContainer>
  );
};

export default Dashboard;
