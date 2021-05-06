import { createGlobalStyle } from "styled-components";
import "normalize.css/normalize.css";
import "bootstrap/scss/bootstrap.scss";

export default createGlobalStyle`
  html, body {
    height: 100%;
    width: 100%;
    min-height: 100%;
  }
  
  #root {
    display: flex;
    flex-flow: column;
    height: 100%;
  }
  
  input {
    background-color: #f6f6f6 !important;
  }

  // Remove default clear button from inputs
  input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
  input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration { display: none; }
`;
