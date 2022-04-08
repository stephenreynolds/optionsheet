import styled from "styled-components";

export const InputGroup = styled.div`
  margin: 1rem 0;

  input {
    width: 250px;

    &[type="checkbox"] {
      width: initial;
      margin-left: 1ch;
      vertical-align: middle;
    }
  }

  input, textarea, button, div {
    margin-left: 0;
  }

  &.bottom-buttons button {
    margin-right: 0.5rem !important;
  }
`;