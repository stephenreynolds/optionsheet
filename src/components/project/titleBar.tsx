import { Link } from "react-router-dom";
import { PLPill } from "../shared/pill";
import { formatPrice } from "../../common/tradeUtils";
import StarButton from "./starButton";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { getNetProfit } from "../../redux/selectors/tradeSelectors";

const TitleBarDiv = styled.div`
  padding: 1.5rem 40px 0.5rem 40px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  h2 {
    display: inline-block;
    margin-right: 1rem;

    .project-link {
      color: ${props => props.theme.dark.text};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const TitleBar = ({ username, project }) => {
  const netProfit = useSelector((state) => getNetProfit(state));

  return (
    <TitleBarDiv>
      <div>
        <h2 className="m-0">
          <Link to={`/${username}`} className="project-link">
            {username}
          </Link>
          <span> / </span>
          <Link to={`/${username}/${project.name}`} className="project-link">
            {project.name}
          </Link>
        </h2>
        <PLPill value={netProfit.toString()} style={{ marginRight: "0.25rem" }}>
          {formatPrice(netProfit)}
        </PLPill>
      </div>

      <div>
        <StarButton username={username} projectName={project.name} />
      </div>
    </TitleBarDiv>
  );
};

export default TitleBar;