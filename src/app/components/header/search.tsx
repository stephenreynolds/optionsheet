import { Form } from "react-bootstrap";
import styled from "styled-components";

const StyledSearch = styled(Form)`
  flex-grow: 1;

  input {
    width: 270px;
    transition: width 0.2s;

    &:focus {
      width: 540px;
    }
  }
`;

const Search = () => {
  return (
    <StyledSearch>
      <Form.Control
        type="search"
        name="search"
        size="sm"
        className="search"
        placeholder="Search trades, projects, and users..."
      />
    </StyledSearch>
  );
};

export default Search;
