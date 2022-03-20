import { Link } from "react-router-dom";
import { PLPill, TagPill } from "../shared/pill";
import { formatPrice } from "../../common/tradeUtils";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { getNetProfit } from "../../redux/selectors/tradeSelectors";

const TitleBarDiv = styled.div`
  padding: 1.5rem 1.5rem 1.5rem 40px;
  display: flex;
  align-items: baseline;

  .project-link {
    color: ${props => props.theme.dark.text};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .tags {
    margin-left: 1rem;
  }
`;

const TitleBar = ({ username, project }) => {
  const netProfit = useSelector((state) => getNetProfit(state));

  return (
    <TitleBarDiv>
      <h2 className="m-0">
        <Link to={`/${username}`} className="project-link">
          {username}
        </Link>
        <span> / </span>
        <Link to={`/${username}/${project.name}`} className="project-link">
          {project.name}
        </Link>
      </h2>
      <div className="tags">
        <PLPill value={netProfit.toString()} style={{ marginRight: "0.25rem" }}>
          {formatPrice(netProfit)}
        </PLPill>

        {project.tags.map((tag) => (
          <TagPill key={tag.name}>{tag.name}</TagPill>
        ))}
      </div>
    </TitleBarDiv>
  );
};

export default TitleBar;