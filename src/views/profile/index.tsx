import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { getUser } from "../../common/api/user";
import { User } from "../../common/models/user";
import { Container } from "../../styles";
import ProfileTab from "./components/profileTab";
import ProfileSidebar from "./components/sidebar";
import ProfileTabs from "./components/tabs";

const Profile = () => {
  const { username } = useParams<{ username: string }>();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUser(username)
      .then((data) => {
        setUser(data);
      })
      .catch(error => {
        toast.error(error.message);
      });
  }, [username]);

  if (!user) {
    return null;
  }

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