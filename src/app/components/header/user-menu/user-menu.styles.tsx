import { Dropdown, DropdownButton } from "react-bootstrap";
import styled from "styled-components";

export const StyledDropdownButton = styled(DropdownButton)`
  button {
    background-color: transparent !important;
    border: none;
    outline: none !important;

    &:hover,
    &:focus,
    &:active {
      background-color: transparent !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }
  }
`;

export const StyledDropdownItem = styled(Dropdown.Item)`
  color: #000 !important;
  line-height: 1.5rem;

  &:active {
    background-color: initial;
  }
`;