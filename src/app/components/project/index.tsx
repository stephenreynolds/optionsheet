import { Route, Switch, useParams } from "react-router-dom";
import Header from "../header";
import TradeList from "./trade-list";
import ProjectSettings from "./settings";
import { Container } from "react-bootstrap";
import styled from "styled-components";
import ProjectNav from "./project-nav";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as actions from "../../redux/actions/projectActions";
import { getProject } from "../../redux/selectors/projectSelectors";

const ProjectContainer = styled(Container)`
  padding: 0;
`;

const projectRoot = "/user/:username/project/:project";

const Project = (): JSX.Element => {
  const { username, project: projectName } = useParams<{
    username: string;
    project: string;
  }>();
  const dispatch = useDispatch();
  const project = useSelector((state) => getProject(state));

  useEffect(() => {
    dispatch(actions.getProjectByName(username, projectName));
  }, []);

  return (
    <>
      <Header />
      <Switch>
        <Route path={projectRoot}>
          <ProjectContainer>
            <ProjectNav />
            <Switch>
              <Route
                path={`${projectRoot}/settings`}
                component={ProjectSettings}
              />
              <Route path={projectRoot}>
                <TradeList project={project} />
              </Route>
            </Switch>
          </ProjectContainer>
        </Route>
      </Switch>
    </>
  );
};

export default Project;
