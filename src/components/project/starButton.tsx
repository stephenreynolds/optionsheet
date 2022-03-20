import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarred } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { checkProjectStarred, starProject, unStarProject } from "../../common/api/user";

const StarButton = ({ username, projectName }) => {
  const [starred, setStarred] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkProjectStarred(username, projectName)
      .then(() => setStarred(true))
      .catch(() => setStarred(false))
      .finally(() => setLoading(false));
  }, []);

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
          <FontAwesomeIcon icon={faStarred} /> Star
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faStar} /> Starred
        </>
      )}
    </button>
  );
};

export default StarButton;