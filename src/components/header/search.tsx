import styled from "styled-components";

const SearchInput = styled.input`
  width: 270px;
  margin-left: 1rem;
  transition: width 0.2s;

  &:focus {
    width: 540px;
  }
`;

const Search = () => {
  return (
    <SearchInput type="search" placeholder="Search trades, projects, and users..." />
  );
};

export default Search;