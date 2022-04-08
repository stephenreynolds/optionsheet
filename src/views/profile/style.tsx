import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const StyledIcon = styled(FontAwesomeIcon)`
  margin-right: 0.5em;
  color: ${props => props.theme.dark.borderLight};
  font-size: 1.1em;
`;

export const PageTabs = styled.nav`
  box-shadow: inset 0 -1px 0 ${props => props.theme.dark.border};
  padding: 0 32px;
  margin-top: 1rem;

  ul {
    list-style-type: none;
    margin: 0 auto;
    padding: 0;
    display: flex;
    align-items: center;
    width: fit-content;

    li {
      a {
        padding: 1rem;
        color: ${props => props.theme.dark.text};
        text-decoration: none;
        transition: box-shadow 0.12s ease-out;
        display: inline-flex;
        align-items: center;

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

    button {
      margin-left: 1rem;
    }
  }
`;