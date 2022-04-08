import styled from "styled-components";

export const CircleImage = styled.img`
  border: 2px solid ${props => props.theme.dark.border};
  border-radius: 999px;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;