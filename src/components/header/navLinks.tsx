import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledNav = styled.nav`
  ul {
    padding-left: 0;
    list-style-type: none;
    
    li {
      display: inline-block;
      margin-left: 1rem;
      margin-right: 1rem;
      
      a {
        color: ${props => props.theme.dark.text};
        font-weight: 600;
      }
    }
  }
`;

const NavLinks = () => {
  return (
    <StyledNav>
      <ul>
        <li>
          <Link to="/trending">Trending</Link>
        </li>
        <li>
          <Link to="/portfolio-assistant">Portfolio Assistant</Link>
        </li>
      </ul>
    </StyledNav>
  );
};

export default NavLinks;