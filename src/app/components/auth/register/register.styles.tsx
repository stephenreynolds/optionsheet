import styled from "styled-components";

export const RegisterForm = styled.form`
  width: 400px;
  margin-top: 2rem;
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
