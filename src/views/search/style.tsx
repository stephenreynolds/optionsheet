import color from "color";
import styled from "styled-components";
import { Container, NumberCircle } from "../../styles";

export const SearchContainer = styled(Container)`
  display: flex;

  .search-items {
    flex: 1;

    h2 {
      font-weight: 600;
    }

    .pagination {
      width: fit-content;
      margin: 0 auto;
    }
  }
`;

export const SidebarNav = styled.nav`
  border: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
  height: fit-content;
  width: 256px;
  margin-right: 2rem;

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    color: inherit;
    border-bottom: 1px solid ${props => props.theme.dark.border};

    &.selected {
      background-color: ${props => color(props.theme.dark.text).fade(0.9)};
      border-left: 3px solid ${props => props.theme.dark.accent};
      font-weight: 600;
      padding-left: 0.8rem;
    }

    &:hover {
      text-decoration: none;
      background-color: ${props => color(props.theme.dark.text).fade(0.85)};
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const ResultCount = styled(NumberCircle)`
  background-color: ${props => props.count > 0 ? "#6a7079" : "#3e4146"};
  font-weight: 600;
`;

export const TradeCardDiv = styled.div`
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 1rem 1rem 1rem 0;
  border-top: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
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

  .user-link {
    font-size: 16px;
  }

  .tags {
    margin-top: 1rem;
  }
`;

export const UserCardDiv = styled.div`
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 1rem 1rem 1rem 0;
  border-top: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
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

  .user-link {
    font-size: 16px;
  }

  .tags {
    margin-top: 1rem;
  }
`;