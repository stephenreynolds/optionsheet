import { Route, Switch } from "react-router-dom";
import Dashboard from "./dashboard";
import Header from "../header";
import TradeList from "./trade-list";
import ProjectSettings from "./settings";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import ProjectNav from "./project-nav";

const ProjectContainer = styled(Container)`
  padding: 0;
`;

const projectRoot = "/user/:username/project/:project";

const Project = (): JSX.Element => {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path={projectRoot}>
          <ProjectContainer>
            <ProjectNav />
            <Switch>
              <Route
                path={`${projectRoot}/settings`}
                component={ProjectSettings}
              />
              <Route path={projectRoot} component={TradeList} />
            </Switch>
          </ProjectContainer>
        </Route>
      </Switch>
    </>
  );
};

export default Project;
