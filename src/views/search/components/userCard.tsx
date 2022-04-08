import moment from "moment";
import { Link } from "react-router-dom";
import { UserSearchProps } from "../../../common/models/search";
import { UserCardDiv } from "../style";

const UserCard = ({ user }: { user: UserSearchProps }) => {
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