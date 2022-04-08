import color from "color";
import styled from "styled-components";
import { Container } from "../../styles";

export const LoginContainer = styled(Container)`
  width: 400px;

  .login-error {
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
    margin: 0;
  }
`;