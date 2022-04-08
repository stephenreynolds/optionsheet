import styled from "styled-components";

export const PaginationContainer = styled.div`
  button {
    margin-left: 0;
    margin-right: 0;
    border-radius: 0;

    &.page-first {
      border-radius: 5px 0 0 5px;
    }

    &.page-last {
      border-radius: 0 5px 5px 0;
    }
  }
`;