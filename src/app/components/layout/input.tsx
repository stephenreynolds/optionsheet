import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  height: 2.3rem;
  margin-top: 3px;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #1271ff;
    border: 1px solid #609eff;
  }
`;

export default Input;