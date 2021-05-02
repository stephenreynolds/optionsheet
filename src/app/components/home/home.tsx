import { Hero } from "./home.styles";
import { Container } from "../layout/layout.styles";

const Home = (): JSX.Element => (
  <Hero>
    <Container>
      <h1>A platform for logging and analyzing stock and option trades.</h1>
    </Container>
  </Hero>
);

export default Home;
