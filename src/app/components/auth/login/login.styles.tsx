import styled from "styled-components";
import { Link } from "react-router-dom";

export const LoginForm = styled.form`
  width: 400px;
  margin-top: 2rem;
`;

export const ForgotPassword = styled(Link)`
  float: right;
  font-weight: normal;
`;

export const CreateAccount = styled.div`
  border: 1px solid #c2c2c2;
  border-radius: 6px;
  margin-top: 1rem;
  padding: 10px;
  text-align: center;
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 0.5rem;
  color: #ff0000;
  
  ul {
    margin-top: 0;
    padding-left: 1.5rem;
    
    li {
      padding-top: 0.2em;
    }
  }
`;