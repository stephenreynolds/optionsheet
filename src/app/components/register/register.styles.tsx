import styled from "styled-components";

export const Centered = styled.div`
  margin: 2rem auto 0;
  width: fit-content;
  
  h1 {
    text-align: center;
  }
`;

export const Form = styled.form`
  min-width: 400px;
  margin-top: 2rem;
  
  label {
    display: block;
    font-weight: bold;

    &:after {
      content: " *";
      color: #c70000;
    }
  }

  input {
    width: 100%;
    height: 2rem;
    margin: 0.3rem 0 1rem 0;
    border: 1px solid #d4d4d4;
    border-radius: 6px;
    background-color: #f6f6f6;
    box-sizing: border-box;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px #1271ff;
      border: 1px solid #609eff;
      margin-bottom: 14px;
    }
  }

  button {
    width: 100%;
    padding: 0.6rem;
    border: none;
    border-radius: 6px;
    background-color: #01ba01;
    color: #fff;
    font-weight: bold;
    transition: background-color 0.2s;

    &:hover {
      cursor: pointer;
      background-color: #48c948;
    }
  }
  
  a {
    text-decoration: none;
    color: #1271ff;
  }
`;