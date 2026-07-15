import styled from "styled-components";

export const Header = styled.section`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2.5)};
  min-width: 0;
`;

export const Avatar = styled.div<{ $role: string }>`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 3px solid ${({ theme }) => theme.colors.surface.card};
  outline: 2px solid ${({ theme }) => theme.colors.border.subtle};
  font-size: 28px;

  background: ${({ $role, theme }) =>
    $role === "ADMIN"
      ? "rgba(22, 163, 74, 0.12)"
      : `${theme.colors.brand.secondary}14`};
  color: ${({ $role, theme }) =>
    $role === "ADMIN" ? "#16A34A" : theme.colors.brand.secondary};
`;

export const ProfileText = styled.div`
  min-width: 0;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  min-width: 0;
`;

export const Name = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Email = styled.p`
  margin: 0;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: center;
`;

export const ActionGhost = styled.button`
  height: 38px;
  padding: 0 ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.surface.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.motion.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border-color: ${({ theme }) => theme.colors.brand.secondary};
  }
`;

export const ActionSolid = styled.button<{ $danger?: boolean }>`
  height: 38px;
  padding: 0 ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  cursor: pointer;
  transition: ${({ theme }) => theme.motion.normal};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  display: inline-flex;
  align-items: center;
  gap: 6px;

  background: ${({ theme, $danger }) =>
    $danger ? theme.colors.state.danger : theme.colors.state.success};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    filter: brightness(0.95);
  }
`;

export const ErrorBanner = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  padding: ${({ theme }) => theme.spacing(1.25)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid rgba(220, 38, 38, 0.22);
  background: rgba(220, 38, 38, 0.08);
  color: ${({ theme }) => theme.colors.state.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const PermissionChip = styled.span<{ $allowed: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;

  ${({ $allowed, theme }) =>
    $allowed
      ? `
    background: rgba(22, 163, 74, 0.10);
    border: 1px solid rgba(22, 163, 74, 0.22);
    color: #16A34A;
  `
      : `
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid ${theme.colors.border.subtle};
    color: ${theme.colors.text.muted};
    text-decoration: line-through;
  `}
`;

export const ModalBackdrop = styled.div<{ $isOpen: boolean }>`
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

export const ModalContainer = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
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

export const ModalTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing(1)} 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-align: center;
`;

export const ModalMessage = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  text-align: center;
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing(1.25)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  background: ${({ theme }) => theme.colors.surface.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: inherit;
  outline: none;
  transition: border-color ${({ theme }) => theme.motion.normal};
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand.secondary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

export const ModalError = styled.p`
  margin: ${({ theme }) => theme.spacing(1)} 0 0 0;
  color: ${({ theme }) => theme.colors.state.danger};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  text-align: center;
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2.5)};
  width: 100%;
`;

export const ModalButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid transparent;
  cursor: pointer;
  transition: ${({ theme }) => theme.motion.normal};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  ${({ $variant, theme }) =>
    $variant === "secondary"
      ? `
    background: ${theme.colors.surface.card};
    border-color: ${theme.colors.border.default};
    color: ${theme.colors.text.primary};
    &:hover { box-shadow: ${theme.shadows.sm}; }
  `
      : `
    background: ${theme.colors.state.success};
    color: ${theme.colors.text.inverse};
    &:hover { box-shadow: ${theme.shadows.sm}; filter: brightness(0.95); }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
