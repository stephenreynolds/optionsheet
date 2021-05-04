import { createGlobalStyle } from "styled-components";
import Color from "color";

export default createGlobalStyle`
  html, body, #root {
    margin: 0;
    font-family: sans-serif;
    font-size: 14px;
  }
  
  a {
    text-decoration: none;
    color: #1271ff;
    
    &:hover {
      color: ${Color("#1271ff").darken(0.2)};
    }
  }
  
  .text-center {
    text-align: center;
  }
  
  
  .mx-auto {
    margin: 0 auto;
  }
  
  .mt-
`;
