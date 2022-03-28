import styled from "styled-components";

const StyledSpan = styled.span`
    user-select: none;

    &:hover {
      cursor: pointer;
      color: ${props => props.theme.dark.accent};
    }
  `;

const TextButton = ({ onClick, children }) => <StyledSpan onClick={onClick}>{children}</StyledSpan>;

export default TextButton;