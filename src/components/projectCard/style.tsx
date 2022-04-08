import styled from "styled-components";

export const ProjectCardDiv = styled.div`
  margin: 0.5rem 0.5rem 1.5rem 0;
  padding: 1rem 1rem 0 0;
  border-top: 1px solid ${props => props.theme.dark.border};
  transition: background-color 0.2s ease;

  &:first-child {
    margin-top: 0;
  }

  a.trade-link {
    color: ${props => props.theme.dark.text};
    
    h1 {
      margin-bottom: 0;
      font-weight: 600;
    }
  }

  .project-link {
    font-size: 16px;
  }

  .tags {
    margin-top: 1rem;
  }
`;