import Header from "../header/header";
import { Route, Switch } from "react-router-dom";
import Login from "./login/login";
import Register from "./register/register";
import NotFound from "../error/not-found";

const Authenticate = (): JSX.Element => (
  <>
    <Header />
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  </>
);

export default Authenticate;
