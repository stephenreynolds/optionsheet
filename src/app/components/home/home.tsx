import { Hero } from "./home.styles";
import { Container } from "../layout/container";
import Header from "../header/header";

const Home = (): JSX.Element => (
  <>
    <Hero>
      <Header transparent />
      <Container>
        <h1 className="text-center">
          A platform for logging and analyzing stock and option trades.
        </h1>
      </Container>
    </Hero>
    <Container>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis minus
      natus quibusdam repudiandae voluptatem. Delectus doloribus eaque maiores
      nulla perferendis recusandae sed? Corporis debitis doloribus est iure quo
      saepe voluptas!
    </Container>
  </>
);

export default Home;
