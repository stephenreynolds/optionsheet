import { Route, Switch } from "react-router-dom";
import Home from "./home/home";
import NotFound from "./not-found/not-found";
import Header from "./header/header";
import Login from "./login/login";
import Register from "./register/register";

const App = (): JSX.Element => (
  <>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  </>
);

export default App;
