import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTrash, FaExclamationTriangle, FaInfoCircle, FaCheck, FaTimes } from "react-icons/fa";
import Button from "../Button";

type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: <FaTrash />,
    confirmIcon: <FaTrash />,
  },
  warning: {
    icon: <FaExclamationTriangle />,
    confirmIcon: <FaExclamationTriangle />,
  },
  info: {
    icon: <FaInfoCircle />,
    confirmIcon: <FaCheck />,
  },
};

const Backdrop = styled.div<{ $isOpen: boolean }>`
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
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition:
    opacity ${({ theme }) => theme.motion.normal},
    visibility ${({ theme }) => theme.motion.normal};
`;

const DialogContainer = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.surface.card};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.md};
  min-width: 350px;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transform: ${({ $isOpen }) => ($isOpen ? "scale(1)" : "scale(0.95)")};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition:
    transform ${({ theme }) => theme.motion.normal},
    opacity ${({ theme }) => theme.motion.normal};
`;

const IconContainer = styled.div<{ $variant: ConfirmVariant }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  background: ${({ $variant, theme }) => theme.colors.state[$variant]};
  color: ${({ theme }) => theme.colors.common.white};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-align: center;
`;

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(3)};
  width: 100%;
`;

const StyledButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setShouldRender(false);
    }
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    await onConfirm();
  };

  const handleCancel = () => {
    if (isLoading) return;
    onCancel();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!shouldRender) return null;

  const config = variantConfig[variant];

  return (
    <Backdrop $isOpen={isOpen} onClick={handleBackdropClick} onTransitionEnd={handleTransitionEnd}>
      <DialogContainer $isOpen={isOpen}>
        <IconContainer $variant={variant}>
          {config.icon}
        </IconContainer>

        <Title>{title}</Title>
        <Message>{message}</Message>

        <ButtonGroup>
          <StyledButton
            variant="secondary"
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <FaTimes />
            {cancelLabel}
          </StyledButton>
          <StyledButton
            variant={variant === "danger" ? "danger" : "primary"}
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {config.confirmIcon}
            {isLoading ? "Guardando..." : confirmLabel}
          </StyledButton>
        </ButtonGroup>
      </DialogContainer>
    </Backdrop>
  );
};

export default ConfirmDialog;
