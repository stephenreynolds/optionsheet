import { Container } from "react-bootstrap";

const Profile = ({ user }) => {
  return (
    <Container>
      <h1>{user.username}</h1>
      {user.email}
    </Container>
  );
};

export default Profile;
