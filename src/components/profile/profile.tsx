import ProfileSidebar from "./sidebar";
import { useSelector } from "react-redux";
import { getUser } from "../../redux/selectors/userSelectors";
import { Container } from "../styles";
import ProfileTabs from "./tabs";
import ProfileTab from "./profileTab";

const Profile = () => {
  const user = useSelector((state) => getUser(state));

  return (
    <>
      <ProfileTabs />
      <Container className="d-flex">
        <ProfileSidebar user={user} />
        <ProfileTab />
      </Container>
    </>
  );
};

export default Profile;