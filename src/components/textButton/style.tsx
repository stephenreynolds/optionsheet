import styled from "styled-components";

export const StyledSpan = styled.span`
  user-select: none;

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.dark.accent};
  }
`;