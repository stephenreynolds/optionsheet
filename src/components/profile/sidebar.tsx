import styled from "styled-components";

const ProfileImage = styled.img`
  border: 2px solid ${props => props.theme.dark.border};
  border-radius: 999px;
  height: 200px;
`;

const ProfileSidebar = ({ user }) => {
  return (
    <div style={{maxWidth: "296px", marginTop: "-50px", marginRight: "2rem"}}>
      <div className="text-center">
        <ProfileImage src={user.avatar_url ?? "/img/profile.png"} alt={user.username} />
        <h1 className="fw-bold">{user.username}</h1>
        <p>{user.bio}</p>
      </div>
    </div>
  );
};

export default ProfileSidebar;