import styled from "styled-components";
import { getAvatarUrl } from "../../common/api/user";

const CircleImage = styled.img`
  border: 2px solid ${props => props.theme.dark.border};
  border-radius: 999px;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface ProfileImageProps {
  imageUrl: string;
  username: string;
}

const fallbackUri = "/img/profile.png";

const ProfileImage = ({ imageUrl, username }: ProfileImageProps) => {
  const onError = ({currentTarget}) => {
    currentTarget.onerror = null;
    currentTarget.src = fallbackUri;
  }

  return (
    <CircleImage src={getAvatarUrl(imageUrl)} crossOrigin="anonymous" alt={username} onError={onError} />
  );
};

export default ProfileImage;