import { ChangeEvent, Dispatch, KeyboardEvent, MouseEvent, SetStateAction, useState } from "react";
import { Suggestions, TagInputContainer } from "./style";

interface Props {
  tags?: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  suggestions?: string[];
  className?: string;
}

const TagInput = ({ tags = [], setTags, suggestions = [], className = "" }: Props) => {
  const [input, setInput] = useState("");
  const [isKeyReleased, setIsKeyReleased] = useState(true);
  const [shownSuggestions, setShownSuggestions] = useState([]);

  const onKeyDown = (e: KeyboardEvent) => {
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
      setTags([...tags, trimmedInput]);
      setInput("");
      setShownSuggestions([]);
    }

    if (key === "Backspace" && !input.length && tags.length && isKeyReleased) {
      e.preventDefault();
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      setTags(tagsCopy);
      setInput(poppedTag);
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
    const value = e.target.value;

    setInput(value);

    const filteredSuggestions = suggestions.filter((s) => {
      const ss = s.toLowerCase();
      return value.length && !tags.includes(ss) && ss.startsWith(value.toLowerCase());
    });
    const sortedSuggestions = filteredSuggestions.sort((a, b) => a.length - b.length);

    setShownSuggestions(sortedSuggestions);
  };

  const deleteTag = (e: MouseEvent, index: number) => {
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
              {tag}
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