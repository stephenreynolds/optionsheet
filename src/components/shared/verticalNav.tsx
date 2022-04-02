import styled from "styled-components";
import color from "color";

const VerticalNav = styled.nav`
  margin-right: 3rem;
  width: 100%;

  a {
    display: block;
    margin: 0.2rem 0 0.1em;
    color: ${props => props.theme.dark.text};
    padding-left: 1em;
    line-height: 2.25em;
    border-radius: 6px;

    &.selected {
      background-color: ${props => color(props.theme.dark.text).fade(0.9)};
      font-weight: 600;
    }

    &:hover {
      background-color: ${props => color(props.theme.dark.text).fade(0.85)};
      cursor: pointer;
      text-decoration: none;
    }

    .svg-inline--fa {
      margin-right: 1ch;
    }
  }
`;

export default VerticalNav;