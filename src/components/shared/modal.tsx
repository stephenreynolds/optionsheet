import styled from "styled-components";

const PageMask = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const ModalContainer = styled.div`
  background-color: ${props => props.theme.dark.bg};
  border: 1px solid ${props => props.theme.dark.border};
  border-radius: 6px;
  width: fit-content;
  position: fixed;
  margin: 10vh auto;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  animation-name: fade-in;
  animation-timing-function: ease-in-out;
  animation-duration: 300ms;

  @keyframes fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .modal-heading {
    padding: 1rem;
    background-color: ${props => props.theme.dark.fg};
    
    h3 {
      margin: 0;
    }
  }

  .modal-content {
    padding: 1rem;
  }

  .form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }
`;

const Modal = ({ toggleVisibility, children }) => (
  <>
    <PageMask onClick={toggleVisibility} />
    <ModalContainer>
      {children}
    </ModalContainer>
  </>
);

export default Modal;