import styled from "styled-components";
import { Form } from "react-bootstrap";

export const StyledSearch = styled(Form)`
  flex-grow: 1;

  input {
    width: 270px;
    background-color: ${(props) =>
      props.transparent ? "rgba(0,0,0,0.4)" : "#111"} !important;
    border-color: ${(props) => (props.transparent ? "transparent" : "#777")};
    border-radius: 6px;
    color: #ddd !important;
    transition: width 0.2s;

    &::placeholder {
      color: #ddd;
    }

    &:focus {
      width: 540px;

      &::placeholder {
        color: #bbb;
      }
    }
  }
`;
