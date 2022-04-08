import styled from "styled-components";

export const StatisticItem = styled.div`
  display: flex;
  padding: 0.25rem;

  .statistic-name {
    min-width: 20em;
    vertical-align: middle;
  }

  .all-trades, .long-trades, .short-trades, .neutral-trades {
    text-align: right;
    min-width: 10em;
  }

  &:hover {
    background-color: rgba(64, 70, 79, 0.2);
    cursor: pointer;
    border-radius: 5px;
  }
`;