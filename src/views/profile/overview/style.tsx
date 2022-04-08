import color from "color";
import styled from "styled-components";

export const CardContainer = styled.div`
  opacity: ${props => props.isDragging ? 0 : 1};
  border: 1px solid ${props => props.theme.dark.border};
  border-radius: 6px;
  padding: 1em;

  .description {
    font-size: 12px;
    color: ${props => `${color(props.theme.dark.text).darken(0.2)}`};
    min-height: 2em;
    margin: 0.5em 0;
  }
`;

export const DragHandle = styled.span`
  color: ${props => `${color(props.theme.dark.text).darken(0.2)}`};
  font-size: 75%;

  &:hover {
    cursor: pointer;
  }
`;

export const PinGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
`;

export const ProjectListItem = styled.div`
  padding: 0.3em 0.5em;
  border-radius: 5px;
  user-select: none;

  &:hover {
    background-color: ${props => color(props.theme.dark.text).fade(0.85)};
    cursor: pointer;
  }

  input {
    margin: 0 1ch 0 0;
  }

  &.disabled {
    opacity: 0.5;
    cursor: default;
  }
`;