import { Hero } from "./home.styles";
import { Container } from "../layout/layout.styles";
import Header from "../header/header";

const Home = (): JSX.Element => (
  <Hero>
    <Header transparent />
    <Container>
      <h1>A platform for logging and analyzing stock and option trades.</h1>
    </Container>
  </Hero>
);

export default Home;
