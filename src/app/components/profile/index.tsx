import Header from "../header/header";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { checkUsername } from "../../common/userManager";
import ErrorComponent from "../error";
import { useSelector } from "react-redux";
import { getMyInfo } from "../../redux/selectors/user";

interface MatchParams {
  username: string;
  project: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

const Profile = ({ ...props }: Props): JSX.Element => {
  const [checked, setChecked] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const user = useSelector((state) => getMyInfo(state));

  useEffect(() => {
    const username = props.match.params.username;
    checkUsername(username).then((message) => {
      if (message) {
        setUserFound(true);
      }
      setChecked(true);
    });
  }, [props.match.params.username]);

  if (userFound) {
    return (
      <>
        <Header />
        <Container>
          <h1>{user.username}</h1>
          {user.email}
        </Container>
      </>
    );
  }

  return checked ? <ErrorComponent /> : <></>;
};

export default Profile;
