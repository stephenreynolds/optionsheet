import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarred } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { checkProjectStarred, starProject, unStarProject } from "../../common/api/user";
import styled from "styled-components";

const StarCount = styled.span`
  display: inline-block;
  margin-left: 1ch;
  font-weight: normal;
  background-color: #494949;
  border-radius: 2em;
  padding: 0 6px;
  font-size: 12px;
  line-height: 18px;
`;

const StarButton = ({ username, projectName, stars }) => {
  const [starred, setStarred] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProjectStarred(username, projectName)
      .then(() => setStarred(true))
      .catch(() => setStarred(false))
      .finally(() => setLoading(false));
  }, [username, projectName]);

  const onClick = async () => {
    if (starred) {
      await unStarProject(username, projectName);
      setStarred(false);
    }
    else {
      await starProject(username, projectName);
      setStarred(true);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <button onClick={onClick}>
      {starred ? (
        <>
          <FontAwesomeIcon icon={faStarred} style={{color: "#ffc400"}} /> Starred
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faStar} /> Star
        </>
      )}
      <StarCount>{stars}</StarCount>
    </button>
  );
};

export default StarButton;