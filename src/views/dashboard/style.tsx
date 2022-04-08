import styled from "styled-components";

export const DashboardContainer = styled.div`
  background-color: ${props => props.theme.dark.input.bg};
  display: flex;
  height: 100vh;
  
  .dashboard-content {
    padding: 36px;
  }
`;

export const SidebarContainer = styled.aside`
  background-color: ${props => props.theme.dark.bg};
  border-right: 1px solid ${props => props.theme.dark.border};
  padding: 32px;
  width: 200px;
  
  h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.2rem;
  }
`;