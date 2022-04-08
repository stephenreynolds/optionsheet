import styled from "styled-components";

export const InputGroup = styled.div`
  margin: 1rem 0;

  input {
    width: 100%;
  }
`;

export const ProfileImageSetting = styled.div`
  width: 200px;
  height: 200px;

  &:hover {
    cursor: pointer;
  }

  button {
    display: block;
    position: relative;
    margin-top: -40px;
  }
`;