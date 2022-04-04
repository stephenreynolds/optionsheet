import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import numeral from "numeral";
import { search } from "../../common/api/search";
import { Container } from "../styles";
import TradeCard from "./tradeCard";
import SearchSidebar from "./searchSidebar";
import styled from "styled-components";
import ProjectCard from "../shared/projectCard";
import UserCard from "./userCard";
import { Pagination } from "../shared/pagination";

const SearchContainer = styled(Container)`
  display: flex;

  .search-items {
    flex: 1;

    h2 {
      font-weight: 600;
    }

    .pagination {
      width: fit-content;
      margin: 0 auto;
    }
  }
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [counts, setCounts] = useState({ trades: 0, projects: 0, users: 0 });
  const [index, setIndex] = useState(parseInt(searchParams.get("page")) ?? 1);
  const [increment] = useState(1);
  const [limit] = useState(searchParams.get("limit") ?? 20);

  const searchType = searchParams.get("type") ?? "trade";

  useEffect(() => {
    search(searchParams).then((data) => {
      setSearchResults(data.items);
      setCounts(data.counts);
    });
  }, [searchParams]);

  useEffect(() => {
    if (searchResults.length) {
      const updatedSearchParams = new URLSearchParams(searchParams.toString());
      updatedSearchParams.set("page", index.toString());
      setSearchParams(updatedSearchParams.toString());
      window.scrollTo(0, 0);
    }
  }, [index]);

  const resultCount = counts[`${searchType}s`];

  return (
    <SearchContainer>
      <SearchSidebar searchParams={searchParams} counts={counts} />
      <div className="search-items">
        <h2>{numeral(resultCount).format("0,0")} {searchType} result{searchResults.length === 1 ? "" : "s"}</h2>

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

        {resultCount > limit && (
          <Pagination increment={increment} index={index} setIndex={setIndex} min={1} max={Math.ceil(resultCount / 20) + 1} />
        )}
      </div>
    </SearchContainer>
  );
};

export default Search;