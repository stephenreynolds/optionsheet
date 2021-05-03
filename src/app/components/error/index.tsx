import { Route, Switch } from "react-router-dom";
import NotFound from "./not-found";
import Header from "../header/header";

const ErrorComponent = (): JSX.Element => (
  <>
    <Header />
    <Switch>
      <Route path="/*" component={NotFound} />
    </Switch>
  </>
);

export default ErrorComponent;