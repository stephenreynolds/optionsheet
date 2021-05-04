import Header from "../header/header";
import { Route, Switch } from "react-router-dom";
import Login from "./login/login";
import Register from "./register/register";

const Authenticate = (): JSX.Element => (
  <>
    <Header />
    <Switch>
      <Route path="/authenticate/login" component={Login} />
      <Route path="/authenticate/register" component={Register} />
    </Switch>
  </>
);

export default Authenticate;
