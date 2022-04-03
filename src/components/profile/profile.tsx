import ProfileSidebar from "./sidebar";
import { Container } from "../styles";
import ProfileTabs from "./tabs";
import ProfileTab from "./profileTab";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUser } from "../../common/api/user";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState({});

  useEffect(() => {
    getUser(username)
      .then(result => {
        setUser(result);
      })
      .catch(error => {
        toast.error(error.message);
      });
  }, [username]);

  return (
    <>
      <ProfileTabs />
      <Container className="d-flex" width="1200px">
        <ProfileSidebar user={user} />
        <div className="w-100">
          <ProfileTab username={username} />
        </div>
      </Container>
    </>
  );
};

export default Profile;