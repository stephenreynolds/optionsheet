import { useState } from "react";
import styled from "styled-components";
import { AnalyticsChart } from "./analyticsChart";

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
    background-color: #40464f;
    cursor: pointer;
    border-radius: 5px;
  }
`;

const DropdownContainer = styled.div`
  margin-bottom: 1rem;
`;

export const StatisticDropdown = ({
                                    description = "",
                                    history,
                                    property,
                                    valueTransform = (n) => n,
                                    valueTextTransform = (n) => n,
                                    children
                                  }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
      <div>
        <div onClick={() => setShowDropdown(!showDropdown)}>
          {children}
        </div>
        {showDropdown && (
          <DropdownContainer className="statistic-dropdown">
            <p>{description}</p>
            <AnalyticsChart history={history} property={property}
                            valueTransform={valueTransform} valueTextTransform={valueTextTransform} />
          </DropdownContainer>
        )}
      </div>
    );
  }
;