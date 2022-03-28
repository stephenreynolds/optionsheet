import styled, { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root {
    color-scheme: dark;
  }
  
  html, body {
    margin: 0;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    background-color: ${props => props.theme.dark.bg};
    color: ${props => props.theme.dark.text};
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    font-weight: 400;
  }

  a {
    color: ${props => props.theme.dark.accent};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  hr {
    color: ${props => props.theme.dark.text};
  }

  input, textarea {
    background-color: ${props => props.theme.dark.input.bg};
    color: ${props => props.theme.dark.text};
    border: 1px solid ${props => props.theme.dark.input.border};
    border-radius: 5px;
    outline: none;
    margin: 0.25rem;
    padding: 6px 12px;
    box-sizing: border-box;

    &:focus {
      background-color: ${props => props.theme.dark.input.focus.bg};
      border-color: ${props => props.theme.dark.accent};
    }

    &.invalid {
      border-color: ${props => props.theme.dark.invalid};
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  button, select {
    background-color: ${props => props.theme.dark.button.bg};
    color: ${props => props.theme.dark.button.text};
    font-weight: 600;
    border: 1px solid ${props => props.theme.dark.button.border};
    border-radius: 5px;
    margin: 0.25rem;
    padding: 6px 12px;
    line-height: 1.2;

    &:hover {
      background-color: ${props => props.theme.dark.button.hover.bg};
      cursor: pointer;
    }

    // &:focus, &:focus-visible {
    //   outline: none !important;
      //   background-color: ${props => props.theme.dark.button.hover.bg};
      //   border: 1px solid ${props => props.theme.dark.button.border};
    //   border-radius: 5px;
    // }

    &:disabled {
      opacity: 0.5;

      &:hover {
        background-color: ${props => props.theme.dark.button.bg};
        cursor: default;
      }
    }
  }

  select {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  textarea {
    margin: 0.25rem;
    padding: 6px 12px;
    width: 100%;
    resize: vertical;
    border-radius: 5px;
  }

  label {
    display: block;
    font-weight: 600;
    padding-bottom: 0.2em;
    margin-left: 0.25rem;
    user-select: none;
  }

  hr {
    border: 1px solid ${props => props.theme.dark.input.border};
    border-bottom: none;
  }

  table {
    tr {
      th {
        padding-right: 3rem;
      }

      &.space-above {
        th, td {
          padding-top: 1rem;
        }
      }
    }

    &.vertical-table {
      text-align: left;
    }
  }

  blockquote {
    background-color: ${props => props.theme.dark.fg};
    width: 100%;
    margin: 0.5rem 0.5rem 0.5rem 0;
    padding: 0.5em;
    border-radius: 5px;
  }

  .text-center {
    text-align: center;
  }

  .fw-normal {
    font-weight: normal;
  }
  
  .fw-bold {
    font-weight: 600;
  }
  
  .muted {
    opacity: 0.5;
  }

  .d-flex {
    display: flex;
  }
  
  .d-inline-block {
    display: inline-block;
  }
  
  .flex-end {
    justify-content: flex-end;
  }

  .space-between {
    justify-content: space-between;
  }

  .align-center {
    align-items: center;
  }
  
  .justify-center {
    justify-content: center;
  }

  .m-0 {
    margin: 0;
  }

  .ml-0 {
    margin-left: 0;
  }

  .mr-0 {
    margin-right: 0;
  }

  .mt-1 {
    margin-top: 36px !important;
  }

  .mb-0 {
    margin-bottom: 0;
  }

  .mb-1 {
    margin-bottom: 36px !important;
  }

  .mr-1 {
    margin-right: 1rem;
  }

  .ml-1 {
    margin-left: 1rem;
  }

  .w-100 {
    width: 100%;
  }
  
  .w-fit-content {
    width: fit-content !important;
  }

  .btn-green {
    background-color: #1b7c1f;
    color: #fff;

    &:focus {
      background-color: #1b7c1f;
    }

    &:hover {
      background-color: #166219;

      &:disabled {
        background-color: #1b7c1f;
      }
    }
  }

  .btn-red {
    background-color: #9d0808;
    color: #fff;

    &:focus {
      background-color: #9d0808;
    }

    &:hover {
      background-color: #790707;

      &:disabled {
        background-color: #9d0808;
      }
    }
  }

  .text-red {
    color: #cb0707;
  }

  // nprogress (loading progress bar)
  #nprogress {
    .bar {
      background: ${props => props.theme.dark.accent};
    }

    .peg {
      box-shadow: 0 0 10px ${props => props.theme.dark.accent}, 0 0 5px ${props => props.theme.dark.accent};
    }
  }
`;

export const theme = {
  dark: {
    bg: "#0d1117",
    fg: "#161b22",
    text: "#c9d1d9",
    accent: "#1b7c1f",
    invalid: "#d0363d",
    border: "#30363d",
    borderLight: "#40464f",
    input: {
      bg: "#010409",
      border: "#30363d",
      focus: {
        bg: "#0d1117"
      }
    },
    button: {
      bg: "#21262d",
      text: "#c9d1d9",
      border: "rgba(240,246,252,0.1)",
      hover: {
        bg: "#30363d",
        border: "#8b949e"
      }
    }
  }
};

export const Container = styled.div`
  margin: 0 auto;
  width: ${props => props.width ? props.width : "1000px"};
  padding: 1rem;
`;

export const NumberCircle = styled.span`
  display: inline-block;
  margin-left: 1ch;
  font-weight: normal;
  background-color: #494949;
  border-radius: 2em;
  padding: 0 6px;
  font-size: 12px;
  line-height: 18px;
`;
