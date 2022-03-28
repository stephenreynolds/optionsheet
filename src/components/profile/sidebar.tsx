import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getUsername } from "../../redux/selectors/userSelectors";
import { useEffect, useState } from "react";
import { PromiseDispatch } from "../../redux/promiseDispatch";
import { updateUser } from "../../redux/actions/userActions";
import { toast } from "react-toastify";

const ProfileImage = styled.img`
  border: 2px solid ${props => props.theme.dark.border};
  border-radius: 999px;
  height: 200px;
`;

const ProfileSidebar = ({ user }) => {
  const myUsername = useSelector((state) => getUsername(state));
  const myProfile = myUsername === user.username;
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const dispatch: PromiseDispatch = useDispatch();

  useEffect(() => {
    setNewBio(user.bio);
  }, [user]);

  const onBioChange = (e) => {
    setNewBio(e.target.value);
  };

  const cancelEdits = () => {
    setNewBio(user.bio);
    setEditing(false);
  };

  const onSaveEdits = () => {
    dispatch(updateUser({ bio: newBio }))
      .then(() => {
        user.bio = newBio;
        setEditing(false);
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div style={{ maxWidth: "296px", marginTop: "-50px", marginRight: "2rem" }}>
      <div>
        <ProfileImage src={user.avatar_url ?? "/img/profile.png"} alt={user.username} />
        <h1 className="fw-bold text-center">{user.username}</h1>
        {editing ? (
          <div>
            <label>Bio</label>
            <textarea value={newBio} onChange={onBioChange} placeholder="Update your bio..." />
            <div className="d-flex">
              <button className="btn-green" onClick={onSaveEdits}>Save</button>
              <button onClick={cancelEdits}>Cancel</button>
            </div>
          </div>
        ) : (
          <p>{newBio}</p>
        )}
        {myProfile && !editing && (
          <button className="w-100 mx-0" onClick={() => setEditing(true)}>Edit profile</button>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;