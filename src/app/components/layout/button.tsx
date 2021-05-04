import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background-color: ${(props) => colors[props.color]};
  color: #fff;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => lightenedColors[props.color]};
  }

  &:disabled {
    cursor: default;
    background-color: ${(props) => desaturatedColors[props.color]};
  }
`;

const colors = {
  green: "#01ba01"
};

const desaturatedColors = {
  green: "#7dbf7d"
};

const lightenedColors = {
  green: "#59c159"
};

export default Button;
