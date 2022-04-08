import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";
import { SearchInput } from "../style";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLElement>();

  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const onSubmit = (e: FormEvent) => {
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