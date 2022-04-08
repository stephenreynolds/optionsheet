import color from "color";
import styled from "styled-components";
import { Container } from "../../styles";

export const RegisterContainer = styled(Container)`
  width: 400px;

  h1 {
    margin-bottom: 1rem;
  }

  .register-error {
    display: inline-block;
    box-sizing: border-box;
    margin-bottom: 1rem;
    padding: 0.5rem;
    width: 100%;
    background-color: ${props => color(props.theme.dark.invalid).darken(0.5)};
    border-radius: 5px;

    .error-icon {
      margin-right: 1ch;
    }
  }

  .help-block {
    display: inline-block;
    margin: 0.5rem 0;
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
  }

  button {
    width: 100%;
    margin-top: 0;
    margin-left: 0;
  }
`;

export const SignInContainer = styled.div`
  border: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
`;