import { Form } from "react-bootstrap";
import { StyledSearch } from "./search.styles";

const Search = ({ transparent }) => {
  return (
    <StyledSearch transparent={transparent}>
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
