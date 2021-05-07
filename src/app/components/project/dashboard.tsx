import ProjectList from "./project-list";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import colors from "../colors";

const DashboardContainer = styled(Container)`
  padding: 0;
`;

const DashboardContent = styled.main`
  border: 1px solid #000;
  border-radius: 5px;
  background-color: ${colors.backgroundDark.lighten(0.4)};
  padding: 1rem;
  margin-left: 1rem;
  height: fit-content;
`;

const Dashboard = (): JSX.Element => {
  return (
    <DashboardContainer className="row mx-auto">
      <ProjectList />
      <DashboardContent className="col">
        <h1>Dashboard</h1>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
