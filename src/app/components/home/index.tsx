import { Container } from "react-bootstrap";
import Header from "../header";

const Home = (): JSX.Element => (
  <>
    <Header />
    <Container>
      <h1 className="lead text-center">
        A platform for logging and analyzing stock and option trades.
      </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis minus
        natus quibusdam repudiandae voluptatem. Delectus doloribus eaque maiores
        nulla perferendis recusandae sed? Corporis debitis doloribus est iure
        quo saepe voluptas! lipsum
      </p>
    </Container>
  </>
);

export default Home;
