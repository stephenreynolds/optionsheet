import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./home/home";
import Dashboard from "./project/dashboard";
import Authenticate from "./auth";
import ErrorComponent from "./error";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/authenticate" component={Authenticate} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={ErrorComponent} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
