import { createGlobalStyle } from "styled-components";
import "normalize.css/normalize.css";
import "bootstrap/scss/bootstrap.scss";
import colors from "./colors";

export default createGlobalStyle`
  html, body, #root {
    background-color: ${colors.backgroundDark};
    color: ${colors.textColor};
  }
  
  input {
    background-color: #111 !important;
    border-color: #777 !important;
    border-radius: 6px;
    color: ${colors.textColor} !important;

    &::placeholder {
      color: ${colors.textColor} !important;
    }

    &:focus {
      &::placeholder {
        color: ${colors.textColor.darken(0.4)} !important;
      }
    }
  }

  // Remove default clear button from inputs
  input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
  input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration { display: none; }
`;
