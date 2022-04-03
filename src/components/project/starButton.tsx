import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarred } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { checkProjectStarred, starProject, unStarProject } from "../../common/api/user";
import { NumberCircle } from "../styles";

interface Props {
  username: string;
  projectName: string;
  stars: number;
}

const StarButton = ({ username, projectName, stars }: Props) => {
  const [loading, setLoading] = useState(true);
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(stars);

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
      setStarCount(prevState => prevState - 1);
    }
    else {
      await starProject(username, projectName);
      setStarred(true);
      setStarCount(prevState => prevState + 1);
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
      <NumberCircle>{starCount}</NumberCircle>
    </button>
  );
};

export default StarButton;