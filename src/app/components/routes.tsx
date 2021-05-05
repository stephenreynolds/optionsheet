import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./home/home";
import Authenticate from "./auth";
import Profile from "./profile";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={["/", "/home"]} component={Home} />
      <Route
        path={["/login", "/register", "/resetpassword"]}
        component={Authenticate}
      />
      <Route path="/:username" component={Profile} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
