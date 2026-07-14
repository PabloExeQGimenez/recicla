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

export const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.lg};
  object-fit: cover;
  box-shadow: ${({ theme }) => theme.shadows.md};
  flex: 0 0 auto;
  border: 3px solid ${({ theme }) => theme.colors.surface.card};
  outline: 2px solid ${({ theme }) => theme.colors.border.subtle};
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
