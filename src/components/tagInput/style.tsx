import styled from "styled-components";

export const TagInputContainer = styled.div`
  margin: 0.25rem;
  background-color: ${props => props.theme.dark.input.bg};
  border: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
  display: flex;
  overflow-x: auto;

  .tags {
    display: flex;

    .tag {
      display: flex;
      align-items: center;
      height: 2em;
      margin: 3px 5px 3px 0;
      padding: 0 5px 0 10px;
      background-color: ${props => props.theme.dark.accent};
      border-radius: 5px;
      white-space: nowrap;

      &:first-child {
        margin-left: 5px;
      }

      button {
        display: flex;
        padding: 6px;
        border: none;
        background-color: unset;
        margin: 0;
      }
    }
  }

  input {
    width: 100% !important;
    min-width: 50% !important;
    margin: 0.25rem !important;
    border: none;
    border-radius: 5px;

    &:focus {
      background-color: ${props => props.theme.dark.input.bg};
    }
  }
`;

export const Suggestions = styled.div`
  background-color: ${props => props.theme.dark.input.bg};
  border: 1px solid ${props => props.theme.dark.border};
  border-top: none;
  border-radius: 0 0 5px 5px;

  .suggestion-item {
    padding: 5px;

    &:hover {
      background-color: ${props => props.theme.dark.border};
      cursor: pointer;
      user-select: none;
    }
  }
`;