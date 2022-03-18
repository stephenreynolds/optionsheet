import styled from "styled-components";
import { NavLink } from "react-router-dom";
import color from "color";
import numeral from "numeral";

const SidebarNav = styled.nav`
  border: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
  height: fit-content;
  width: 256px;
  margin-right: 2rem;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    color: inherit;
    border-bottom: 1px solid ${props => props.theme.dark.border};

    &.selected {
      background-color: ${props => color(props.theme.dark.text).fade(0.9)};
      border-left: 3px solid ${props => props.theme.dark.accent};
      font-weight: 600;
      padding-left: 0.8rem;
    }

    &:hover {
      text-decoration: none;
      background-color: ${props => color(props.theme.dark.text).fade(0.85)};
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const ResultCount = styled.small`
  color: ${props => props.count ? "#fff" : "inherit"};
  background-color: ${props => props.count > 0 ? "#6a7079" : "#3e4146"};
  padding: 0.2em;
  border-radius: 999px;
  font-weight: 600;
  min-width: 1.5em;
  text-align: center;
`;

interface SearchSidebarProps {
  searchParams: URLSearchParams;
  counts: {
    trades: number;
    projects: number;
    users: number;
  };
}

const SearchSidebar = ({ searchParams, counts }: SearchSidebarProps) => {
  const searchType = searchParams.get("type") ?? "trade";

  const tradeUrl = new URLSearchParams(searchParams);
  tradeUrl.set("type", "trade");
  const projectUrl = new URLSearchParams(searchParams);
  projectUrl.set("type", "project");
  const userUrl = new URLSearchParams(searchParams);
  userUrl.set("type", "user");

  return (
    <SidebarNav>
      <NavLink to={`/search?${tradeUrl}`} className={searchType === "trade" ? "selected" : ""}>
        Trades
        <ResultCount className="result-count" count={counts.trades}>
          {numeral(counts.trades).format("0a")}
        </ResultCount>
      </NavLink>
      <NavLink to={`/search?${projectUrl}`} className={searchType === "project" ? "selected" : ""}>
        Projects
        <ResultCount className="result-count" count={counts.projects}>
          {numeral(counts.projects).format("0a")}
        </ResultCount>
      </NavLink>
      <NavLink to={`/search?${userUrl}`} className={searchType === "user" ? "selected" : ""}>
        Users
        <ResultCount className="result-count" count={counts.users}>
          {numeral(counts.users).format("0a")}
        </ResultCount>
      </NavLink>
    </SidebarNav>
  );
};

export default SearchSidebar;