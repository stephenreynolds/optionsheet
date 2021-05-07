import { useEffect, useState } from "react";
import { getUserInfo } from "../../common/userManager";
import ErrorComponent from "../error";
import { User } from "../../common/user";
import { Route, Switch, useParams } from "react-router-dom";
import Profile from "./profile";
import Header from "../header";
import { useSelector } from "react-redux";
import { getMyInfo } from "../../redux/selectors/userSelectors";
import NotFound from "../error/not-found";

const UserComponent = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  let { username } = useParams<{ username: string }>();
  const currentUser = useSelector((state) => getMyInfo(state));

  useEffect(() => {
    if (username) {
      getUserInfo(username)
        .then((user) => {
          setUser(user.data);
          setLoading(false);
        })
        .catch(() => {
          setUser(undefined);
          setLoading(false);
        });
    } else if (currentUser.username) {
      getUserInfo(currentUser.username)
        .then((user) => {
          setUser(user.data);
          setLoading(false);
        })
        .catch(() => {
          setUser(undefined);
          setLoading(false);
        });
    }
  }, [username, setUser, currentUser]);

  if (loading) {
    return <></>;
  }

  if (user) {
    return (
      <>
        <Header />
        <Switch>
          <Route path={["/user", "/profile", `/user/${user.username}`]}>
            <Profile user={user} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </>
    );
  }

  return <ErrorComponent />;
};
export default UserComponent;
