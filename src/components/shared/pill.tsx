import styled from "styled-components";

export const PLPill = styled.span`
  display: ${props => isNaN(props.value) ? "none" : "initial"};
  background-color: ${props =>
          props.value > 0
                  ? "#28a745"
                  : props.value < 0
                          ? "#dc3545"
                          : "#343a40"};
  padding: 0.15rem 0.4rem;
  border-radius: 5px;
  color: #fff;
  font-weight: 600;
  
  &::before {
    content: "${props => props.value > 0 ? "+" : ""}";
  }
`;

export const TagPill = styled.span`
  background-color: #31363d;
  margin-right: 0.25rem;
  padding: 0.15rem 0.4rem;
  border-radius: 5px;
  color: #fff;
  font-weight: 600;

  &:last-child {
    margin: 0;
  }
`;