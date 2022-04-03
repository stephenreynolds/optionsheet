import styled from "styled-components";
import { Dispatch, SetStateAction } from "react";

const PaginationContainer = styled.div`
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

interface Props {
  increment: number;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>
  min?: number;
  max: number;
}

export const Pagination = ({ increment, index, setIndex, min = 0, max }: Props) => {
  const onFirst = () => {
    setIndex(min);
  };

  const onPrevious = () => {
    setIndex(prevState => Math.max(min, prevState - increment));
  };

  const onNext = () => {
    setIndex(prevState => Math.min(prevState + increment, max - increment));
  };

  const onLast = () => {
    setIndex(max - increment);
  };

  return (
    <PaginationContainer className="pagination">
      <button onClick={onFirst} disabled={index === min} className="page-first">First</button>
      <button onClick={onPrevious} disabled={index === min} className="page-prev">Previous</button>
      <button onClick={onNext} disabled={index + increment > max - increment} className="page-next">Next</button>
      <button onClick={onLast} disabled={index + increment > max - increment} className="page-last">Last</button>
    </PaginationContainer>
  );
};

interface CountProps {
  currentCount: number;
  max: number;
  options: number[];
  setCount: (n: number) => void;
}

export const PageSizeSelect = ({ currentCount, max, options, setCount }: CountProps) => {
  const onChange = (e) => {
    const value = parseInt(e.target.value);
    setCount(isFinite(value) ? value : max);
  };

  return (
    <select value={currentCount} onChange={onChange} style={{ marginRight: 0 }}>
      {options.map((option) => {
          return option <= max ? (
            <option key={option} value={option} disabled={option === currentCount}>
              {option < max ? option : "Max"}
            </option>
          ) : null;
        }
      )}
    </select>
  );
};