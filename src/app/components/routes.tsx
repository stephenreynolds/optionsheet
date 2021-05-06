import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./home/home";
import Authenticate from "./auth";
import ErrorComponent from "./error";
import UserComponent from "./user";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={["/", "/home"]} component={Home} />
        <Route
          path={["/login", "/register", "/resetpassword"]}
          component={Authenticate}
        />
        <Route
          exact
          path={["/user", "/profile", "/user/:username"]}
          component={UserComponent}
        />
        <Route component={ErrorComponent} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
