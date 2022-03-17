import styled from "styled-components";
import { Link } from "react-router-dom";
import moment from "moment";

const UserCardDiv = styled.div`
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 1rem 1rem 1rem 0;
  border-top: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
  transition: background-color 0.2s ease;

  &:first-child {
    margin-top: 0;
  }

  a.trade-link {
    color: ${props => props.theme.dark.text};
    
    h1 {
      margin-bottom: 0;
      font-weight: 600;
    }
  }

  .user-link {
    font-size: 16px;
  }

  .tags {
    margin-top: 1rem;
  }
`;

export interface UserCardProps {
  username: string;
  avatarUrl: string;
  bio: string;
  updatedOn: Date;
}

const UserCard = ({ user }: { user: UserCardProps }) => {
  if (!user) {
    return null;
  }

  return (
    <UserCardDiv>
      {/* Link to project */}
      <Link to={`/${user.username}`} className="user-link">
        {user.username}
      </Link>

      {/* Bio */}
      <p>{user.bio}</p>

      {/* Last seen */}
      <p>
        <small>Last seen {moment(new Date(user.updatedOn)).fromNow()}</small>
      </p>
    </UserCardDiv>
  );
};

export default UserCard;