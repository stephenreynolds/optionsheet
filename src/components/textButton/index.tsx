import { StyledSpan } from "./style";

const TextButton = ({ onClick, children }) => <StyledSpan onClick={onClick}>{children}</StyledSpan>;

export default TextButton;