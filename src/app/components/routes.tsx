import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./home/home";
import Authenticate from "./auth";
import ErrorComponent from "./error";
import UserComponent from "./user";
import Project from "./project";

const Routes = ({ isLoggedIn }) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {isLoggedIn ? <Project /> : <Home />}
        </Route>
        <Route exact path="/home" component={Home} />
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
