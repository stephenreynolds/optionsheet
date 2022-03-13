import { useState } from "react";
import styled from "styled-components";

const TagInputContainer = styled.div`
  margin: 0.25rem;
  background-color: ${props => props.theme.dark.input.bg};
  border: 1px solid ${props => props.theme.dark.border};
  border-radius: 5px;
  display: flex;
  overflow-x: auto;

  .tags {
    display: flex;

    .tag {
      display: flex;
      align-items: center;
      height: 2em;
      margin: 3px 5px 3px 0;
      padding: 0 5px 0 10px;
      background-color: ${props => props.theme.dark.accent};
      border-radius: 5px;
      white-space: nowrap;

      &:first-child {
        margin-left: 5px;
      }

      button {
        display: flex;
        padding: 6px;
        border: none;
        background-color: unset;
        margin: 0;
      }
    }
  }

  input {
    width: 100% !important;
    min-width: 50% !important;
    margin: 0.25rem !important;
    border: none;
    border-radius: 5px;

    &:focus {
      background-color: ${props => props.theme.dark.input.bg};
    }
  }
`;

const Suggestions = styled.div`
  background-color: ${props => props.theme.dark.input.bg};
  border: 1px solid ${props => props.theme.dark.border};
  border-top: none;
  border-radius: 0 0 5px 5px;

  .suggestion-item {
    padding: 5px;

    &:hover {
      background-color: ${props => props.theme.dark.border};
      cursor: pointer;
      user-select: none;
    }
  }
`;

const TagInput = ({ tags = [], setTags, suggestions = [], className = "" }) => {
  const [input, setInput] = useState("");
  const [isKeyReleased, setIsKeyReleased] = useState(true);
  const [shownSuggestions, setShownSuggestions] = useState([]);

  const onKeyDown = (e) => {
    const key = e.key;
    const trimmedInput = input.trim().toLowerCase();

    if (key === "Tab" && shownSuggestions.length) {
      e.preventDefault();
      setTags([...tags, shownSuggestions[0]]);
      setInput("");
      setShownSuggestions([]);
    }
    else if ((key === "," || key === "Enter" || key === "Tab") && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      setTags([...tags, { name: trimmedInput }]);
      setInput("");
      setShownSuggestions([]);
    }

    if (key === "Backspace" && !input.length && tags.length && isKeyReleased) {
      e.preventDefault();
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      setTags(tagsCopy);
      setInput(poppedTag.name);
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const onInputChange = (e) => {
    const value = e.target.value;

    setInput(value);

    const filteredSuggestions = suggestions.filter((s) => {
      const ss = s.toLowerCase();
      return value.length && !tags.includes(ss) && ss.startsWith(value.toLowerCase());
    });
    const sortedSuggestions = filteredSuggestions.sort((a, b) => a.length - b.length);

    setShownSuggestions(sortedSuggestions);
  };

  const deleteTag = (e, index) => {
    e.preventDefault();
    setTags(tags.filter((tag, i) => i !== index));
  };

  const onSuggestionClick = (suggestion) => {
    setTags([...tags, suggestion]);
    onInputChange({ target: { value: "" } });
  };

  return (
    <div className={className}>
      <TagInputContainer className={className}>
        <div className="tags">
          {tags.map((tag, index) => (
            <div className="tag" key={index}>
              {tag.name}
              <button onClick={(e) => deleteTag(e, index)}>x</button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Enter a tag..."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp} />
      </TagInputContainer>
      {shownSuggestions.length > 0 && (
        <Suggestions className={className}>
          {shownSuggestions
            .map((suggestion) => (
              <div key={suggestion} className="suggestion-item" onClick={() => onSuggestionClick(suggestion)}>
                {suggestion}
              </div>
            ))}
        </Suggestions>
      )}
    </div>
  );
};

export default TagInput;