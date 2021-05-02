import styles from "styled-components";

const Nav = styles.nav`
  max-width: 1280px;
  margin: 0 auto;
  background-color: blue;
`;

const Header = (): JSX.Element => (
  <Nav>
    <h1>OptionSheet</h1>
  </Nav>
);

export default Header;
