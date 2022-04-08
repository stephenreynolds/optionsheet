import { getAvatarUrl } from "../../common/api/user";
import { CircleImage } from "./style";

interface ProfileImageProps {
  imageUrl: string;
  username: string;
}

const fallbackUri = "/img/profile.png";

const ProfileImage = ({ imageUrl, username }: ProfileImageProps) => {
  const onError = ({ currentTarget }) => {
    currentTarget.onerror = null;
    currentTarget.src = fallbackUri;
  };

  return (
    <CircleImage src={getAvatarUrl(imageUrl)} crossOrigin="anonymous" alt={username} onError={onError} />
  );
};

export default ProfileImage;