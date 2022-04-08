import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const NewProjectContainer = styled.div`
  margin: 0 auto;
  width: 696px;

  h1 {
    margin-bottom: 1rem;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 0.5rem;
  width: 100%;

  label {
    display: block;
  }

  input {
    margin-left: 0;
    width: 100%;

    &[type="checkbox"] {
      width: initial;
      margin-left: 1ch;
      vertical-align: middle;
    }
  }

  textarea {
    margin-left: 0;
  }

  button {
    margin-left: 0;
  }
`;

export const TitleBarDiv = styled.div`
  padding: 1.5rem 40px 0.5rem 40px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  h2 {
    display: inline-block;
    margin-right: 1rem;

    .project-link {
      color: ${props => props.theme.dark.text};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 0.5em;
  color: ${props => props.theme.dark.borderLight};
  font-size: 1.1em;
`;

export const TabNav = styled.nav`
  box-shadow: inset 0 -1px 0 ${props => props.theme.dark.border};
  padding: 0 32px;
  margin-bottom: 32px;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;

    li {
      a {
        padding: 1rem;
        color: ${props => props.theme.dark.text};
        text-decoration: none;
        transition: box-shadow 0.12s ease-out;
        display: inline-flex;

        &:hover {
          cursor: pointer;
          box-shadow: inset 0 -2px 0 ${props => props.theme.dark.borderLight};
        }

        [data-content] {
          &::before {
            content: attr(data-content);
            font-weight: 600;
            display: block;
            height: 0;
            visibility: hidden;
          }
        }

        &.selected {
          box-shadow: inset 0 -2px 0 ${props => props.theme.dark.accent};
          font-weight: 600;

          ${StyledIcon} {
            color: ${props => props.theme.dark.text}
          }
        }
      }
    }

    button.new-trade-btn {
      margin-left: 1rem;
    }
  }
`;