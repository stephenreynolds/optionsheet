import styled from "styled-components";
import { useEffect, useState } from "react";
import { PromiseDispatch } from "../../redux/promiseDispatch";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/actions/userActions";
import { toast } from "react-toastify";
import { getUser } from "../../redux/selectors/userSelectors";

const InputGroup = styled.div`
  margin: 1rem 0;

  input {
    width: 100%;
  }
`;

const ProfileSettings = () => {
  const user = useSelector((state) => getUser(state));
  const [newBio, setNewBio] = useState("");
  const dispatch: PromiseDispatch = useDispatch();

  useEffect(() => {
    setNewBio(user.bio);
  }, [user]);

  const onBioChange = (e) => {
    setNewBio(e.target.value);
  };

  const onUpdateProfile = () => {
    dispatch(updateUser({ bio: newBio }))
      .then(() => {
        toast.success("Profile updated.");
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="w-100">
      <h1>Profile</h1>
      <hr />

      {/* Bio */}
      <InputGroup>
        <label>Bio</label>
        <textarea value={newBio} onChange={onBioChange} placeholder="Update your bio..." />

        <button className="btn-green" onClick={onUpdateProfile}>Update profile</button>
      </InputGroup>
    </div>
  );
};

export default ProfileSettings;