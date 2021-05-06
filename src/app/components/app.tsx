import BaseStyles from "./baseStyles";
import Routes from "./routes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIsLoggedIn, getMyInfo } from "../redux/selectors/userSelectors";
import * as authActions from "../redux/actions/authActions";
import _ from "lodash";

const App = (): JSX.Element => {
  const isLoggedIn = useSelector((state) => getIsLoggedIn(state));
  const user = useSelector((state) => getMyInfo(state));
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn && _.isEmpty(user)) {
      dispatch(authActions.getMyInfo());
    }
  });

  return (
    <>
      <BaseStyles />
      <Routes isLoggedIn={isLoggedIn} />
    </>
  );
};

export default App;
