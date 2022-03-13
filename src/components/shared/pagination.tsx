import styled from "styled-components";

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

export const Pagination = ({ count, index, setIndex, max }) => {
  const onFirst = () => {
    setIndex(0);
  };

  const onPrevious = () => {
    setIndex(prevState => Math.max(0, prevState - count));
  };

  const onNext = () => {
    setIndex(prevState => Math.min(prevState + count, max - count));
  };

  const onLast = () => {
    setIndex(max - count);
  };

  return (
    <PaginationContainer>
      <button onClick={onFirst} disabled={index === 0} className="page-first">First</button>
      <button onClick={onPrevious} disabled={index === 0} className="page-prev">Previous</button>
      <button onClick={onNext} disabled={index + count > max - count} className="page-next">Next</button>
      <button onClick={onLast} disabled={index + count > max - count} className="page-last">Last</button>
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