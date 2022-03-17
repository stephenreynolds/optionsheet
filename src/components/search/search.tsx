import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { search } from "../../common/api/search";
import { Container } from "../styles";
import TradeCard from "./tradeCard";
import SearchSidebar from "./searchSidebar";
import styled from "styled-components";
import ProjectCard from "./projectCard";
import UserCard from "./userCard";

const SearchContainer = styled(Container)`
  display: flex;

  .search-items {
    flex: 1;

    h2 {
      font-weight: 600;
    }
  }
`;

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [counts, setCounts] = useState({ trades: 0, projects: 0, users: 0 });

  useEffect(() => {
    search(searchParams).then((result) => {
      setSearchResults(result.data.items);
      setCounts(result.data.counts);
    });
  }, [searchParams]);

  const searchType = searchParams.get("type") ?? "trade";

  return (
    <SearchContainer>
      <SearchSidebar searchParams={searchParams} counts={counts} />
      <div className="search-items">
        <h2>{searchResults.length} {searchType} result{searchResults.length === 1 ? "" : "s"}</h2>

        {searchResults.map((result, i) => {
          switch (searchType) {
            case "trade":
              return <TradeCard key={i} trade={result} />;
            case "project":
              return <ProjectCard key={i} project={result} />;
            case "user":
              return <UserCard key={i} user={result} />;
          }
        })}
      </div>
    </SearchContainer>
  );
};

export default Search;