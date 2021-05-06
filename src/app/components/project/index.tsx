import { Route, Switch } from "react-router-dom";
import Dashboard from "./dashboard/dashboard";
import Header from "../header/header";

const Project = (): JSX.Element => (
  <>
    <Header />
    <Switch>
      <Route path="/" component={Dashboard} />
    </Switch>
  </>
);

export default Project;
