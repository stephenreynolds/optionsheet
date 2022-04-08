import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border: 1px solid ${props => props.theme.dark.border};
  border-spacing: 0;
  border-radius: 6px;
  background-color: ${props => props.theme.dark.fg};

  th {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-right: 0;
    background-color: #1d232c;
    text-align: center;
    user-select: none;

    &:hover {
      cursor: pointer;
    }
  }

  tbody {
    tr {
      &:hover {
        background-color: #40464f;
        cursor: pointer;
      }

      td {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        border-top: 1px solid ${props => props.theme.dark.border};
        text-align: center;
      }

      &:last-child {
        td:first-child {
          border-bottom-left-radius: 6px;
        }

        td:last-child {
          border-bottom-right-radius: 6px;
        }
      }
    }
  }

  .left-align {
    text-align: left;
  }
`;