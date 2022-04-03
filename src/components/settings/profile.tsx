import styled from "styled-components";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { PromiseDispatch } from "../../redux/promiseDispatch";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getUser } from "../../redux/selectors/userSelectors";
import { setAvatar, updateUser } from "../../common/api/user";
import ProfileImage from "../shared/profileImage";
import { getAuthenticatedUser } from "../../redux/actions/userActions";

const InputGroup = styled.div`
  margin: 1rem 0;

  input {
    width: 100%;
  }
`;

const ProfileImageSetting = styled.div`
  width: 200px;
  height: 200px;

  &:hover {
    cursor: pointer;
  }

  button {
    display: block;
    position: relative;
    margin-top: -40px;
  }
`;

const ProfileSettings = () => {
  const user = useSelector((state) => getUser(state));
  const [newBio, setNewBio] = useState("");
  const profilePictureInput = useRef(null);

  const dispatch: PromiseDispatch = useDispatch();

  useEffect(() => {
    setNewBio(user.bio);
  }, [user]);

  const onBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewBio(e.target.value);
  };

  const onUpdateProfile = () => {
    updateUser({ bio: newBio })
      .then(() => {
        toast.success("Profile updated.");
      })
      .catch((error) => toast.error(error.message));
  };

  const onChangeAvatarClick = () => {
    profilePictureInput.current.click();
  };

  const onChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    // Max file size of 200KB
    if (file.size > 500e3) {
      window.alert("File size must be less than 500 KB.");
      return;
    }

    setAvatar(file)
      .then(() => {
        dispatch(getAuthenticatedUser()).then();
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <div className="w-100">
      <h1>Profile</h1>
      <hr />

      {/* Bio */}
      <InputGroup>
        <div className="d-flex">
          <div style={{ flex: "1", marginRight: "5em" }}>
            <label>Bio</label>
            <textarea value={newBio} onChange={onBioChange} placeholder="Update your bio..." rows={3} />

            <button className="btn-green" onClick={onUpdateProfile}>Update profile</button>
          </div>
          <div>
            <label>Profile picture</label>
            <ProfileImageSetting>
              <div onClick={onChangeAvatarClick}>
                <ProfileImage imageUrl={user.avatar_url} username={user.username} />
              </div>
              <button onClick={onChangeAvatarClick}>Edit</button>
              <input ref={profilePictureInput}
                     type="file"
                     accept="image/x-png,image/gif,image/jpeg"
                     style={{ display: "none" }}
                     onChange={onChangeAvatar} />
            </ProfileImageSetting>
          </div>
        </div>
      </InputGroup>
    </div>
  );
};

export default ProfileSettings;