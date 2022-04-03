import { useSelector } from "react-redux";
import { getUsername } from "../../redux/selectors/userSelectors";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProfileImage from "../shared/profileImage";
import { updateUser } from "../../common/api/user";

const ProfileSidebar = ({ user }) => {
  const myUsername = useSelector((state) => getUsername(state));
  const myProfile = myUsername === user.username;
  const [editing, setEditing] = useState(false);
  const [newBio, setNewBio] = useState("");

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
    updateUser({ bio: newBio })
      .then(() => {
        user.bio = newBio;
        setEditing(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div style={{ maxWidth: "296px", marginTop: "-50px", marginRight: "2rem" }}>
      <div>
        <div style={{ width: "300px", height: "300px", marginBottom: "1em" }}>
          <ProfileImage imageUrl={user.avatar_url} username={user.username} />
        </div>
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