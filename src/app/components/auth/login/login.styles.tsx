import styled from "styled-components";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

export const LoginContainer = styled(Container)`
  width: 400px;
  margin-top: 1.5rem;
`;

export const ForgotPassword = styled(Link)`
  text-align: right;
`;

export const CreateAccount = styled.div`
  border: 1px solid #c2c2c2;
  border-radius: 6px;
  padding: 10px;
  text-align: center;
`;
