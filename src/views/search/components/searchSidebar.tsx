import numeral from "numeral";
import { NavLink } from "react-router-dom";
import { isSearchType, SearchType } from "../../../common/api/search";
import { ResultCount, SidebarNav } from "../style";

interface SearchSidebarProps {
  searchParams: URLSearchParams;
  counts: {
    trades: number;
    projects: number;
    users: number;
  };
}

const SearchSidebar = ({ searchParams, counts }: SearchSidebarProps) => {
  const searchParamsType = searchParams.get("type");
  const searchType: SearchType = isSearchType(searchParamsType) ? searchParamsType : "trade";

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