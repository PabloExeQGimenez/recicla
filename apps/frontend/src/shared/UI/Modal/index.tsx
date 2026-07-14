import styled from "styled-components";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface.card};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.sm};
  min-width: 350px;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const CloseModal = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  position: absolute;
  top: 10px;
  right: 14px;
  cursor: pointer;
`;

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <Backdrop onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseModal onClick={onClose}>x</CloseModal>
        {children}
      </ModalContainer>
    </Backdrop>
  );
};

export default Modal;
