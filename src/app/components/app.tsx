import {Route, Switch} from "react-router-dom";
import Home from "./home/home";
import NotFound from "./not-found/not-found";
import Header from "./header/header";

const App = (): JSX.Element => (
  <>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  </>
);

export default App;
