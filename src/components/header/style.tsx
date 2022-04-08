import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const StyledHeader = styled.header`
  background-color: ${props => props.theme.dark.fg};
  padding: 12px 32px;
  display: flex;
  align-items: center;
`;

export const BrandLink = styled(Link)`
  color: ${props => props.theme.dark.text};
  text-decoration: none;
  transition: opacity 0.4s ease;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.75;
    text-decoration: none;
  }
  
  img {
    max-height: 2em;
  }
`;

export const RightMenu = styled.div`
  flex: 1 1 auto;
  text-align: right;
`;

export const StyledIcon = styled(FontAwesomeIcon)`
  color: ${props => props.theme.dark.text};
  font-size: 10px;
  margin: auto 0.5rem;

  &:hover {
    cursor: pointer;
    color: #aaa;
  }
`;

export const Dropdown = styled.button`
  border: none;
  background: none;
  padding: 0;
  user-select: none;

  &:focus, &:focus-visible {
    border: none;
    background: none;
  }

  &:hover {
    background: none;
  }
`;

export const DropdownItem = styled.button`
  display: block;
  background: none;
  color: ${props => props.theme.dark.text};
  text-decoration: none;
  text-align: left;
  border: none;
  border-radius: 0;
  padding: 0.5rem 1rem;
  margin: 0;
  width: 100%;

  &:focus {
    border: none;
  }
`;

export const DropdownMenu = styled.div`
  border: 1px solid ${props => props.theme.dark.button.border};
  border-radius: 5px;
  margin-top: 0.25rem;
  width: 154px;
  position: absolute;
  right: 32px;
  background-color: ${props => props.theme.dark.fg};
`;

export const SearchInput = styled.input`
  width: 270px;
  margin-left: 1rem;
  transition: width 0.2s;

  &:focus {
    width: 540px;
  }
`;

const ButtonLink = styled(Link)`
  padding: 0.5rem;
  font-size: 16px;
  text-decoration: none;
  transition: opacity 0.4s ease;
  color: ${props => props.theme.dark.text};

  &:hover {
    opacity: 0.75;
    text-decoration: none;
    color: ${props => props.theme.dark.text};
  }
`;

export const LoginLink = styled(ButtonLink)``;

export const SignUpLink = styled(ButtonLink)`
  border: 1px solid ${props => props.theme.dark.text};
  border-radius: 5px;
  margin-left: 0.5rem;
`;