import { Dropdown, DropdownButton } from "react-bootstrap";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const StyledDropdownButton = styled(DropdownButton)`
  display: inline-block;
  
  button {
    background-color: transparent !important;
    border: none;
    outline: none !important;

    &:hover,
    &:focus,
    &:active {
      color: #aaa;
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

export const StyledIcon = styled(FontAwesomeIcon)`
  color: #fff;
  margin: auto 0.5rem;
  font-size: 18px;
  
  &:hover {
    cursor: pointer;
    color: #aaa;
  }
`;