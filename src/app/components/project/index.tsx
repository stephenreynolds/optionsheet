import { Route, Switch } from "react-router-dom";
import Dashboard from "./dashboard";
import Header from "../header/header";

const Project = (): JSX.Element => (
  <>
    <Header />
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  </>
);

export default Project;
