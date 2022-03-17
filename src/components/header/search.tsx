import { useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";

const SearchInput = styled.input`
  width: 270px;
  margin-left: 1rem;
  transition: width 0.2s;

  &:focus {
    width: 540px;
  }
`;

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLElement>();

  const onSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    navigate({
      pathname: "/search",
      search: `?${createSearchParams({ q: searchInput })}`
    });
    inputRef.current.blur();
  };

  return (
    <form onSubmit={onSubmit}>
      <SearchInput
        type="search"
        placeholder="Search trades, projects, and users..."
        value={searchInput}
        onChange={onSearchInputChange}
        ref={inputRef}/>
    </form>
  );
};

export default Search;