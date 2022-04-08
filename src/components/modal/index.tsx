import { ModalContainer, PageMask } from "./style";

const Modal = ({ toggleVisibility, children }) => (
  <>
    <PageMask onClick={toggleVisibility} />
    <ModalContainer>
      {children}
    </ModalContainer>
  </>
);

export default Modal;