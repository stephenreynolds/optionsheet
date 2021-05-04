import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./home/home";
import Authenticate from "./auth";
import ErrorComponent from "./error";
import Project from "./project";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/authenticate" component={Authenticate} />
      <Route path="/dashboard" component={Project} />
      <Route component={ErrorComponent} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
