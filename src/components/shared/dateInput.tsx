import DatePicker from "react-date-picker";
import styled from "styled-components";

const DateInput = styled(DatePicker)`
  .react-date-picker__wrapper.react-date-picker__wrapper {
    background-color: ${props => props.theme.dark.input.bg};
    color: ${props => props.theme.dark.text};
    border: 1px solid ${props => props.theme.dark.input.border};
    border-radius: 5px;
    padding-left: 0.5em;
    margin-top: 0.3rem;
    margin-left: 0.2rem;
    margin-right: 0.2rem;

    input {
      margin: 0;
    }

    button {
      margin: 0;

      .react-date-picker__button__icon.react-date-picker__button__icon {
        stroke: ${props => props.theme.dark.input.border};
      }

      &:enabled:hover, &:enabled:focus {
        .react-date-picker__button__icon.react-date-picker__button__icon {
          stroke: ${props => props.theme.dark.accent};
        }
      }
    }
  }

  .react-calendar.react-calendar {
    background-color: ${props => props.theme.dark.bg};
    border: 1px solid ${props => props.theme.dark.input.border};
    border-radius: 5px;

    button {
      &:enabled:hover {
        background-color: ${props => props.theme.dark.fg};
      }

      &.react-calendar__tile--active.react-calendar__tile--active {
        background-color: ${props => props.theme.dark.accent};
      }
    }
  }
`;

export default DateInput;