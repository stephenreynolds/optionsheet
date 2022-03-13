import { Container } from "../styles";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container className="text-center mt-1">
      <h1>Looks like that page doesn't exist.</h1>
      <Link to="/">Go Home</Link>
    </Container>
  );
};

export default NotFound;