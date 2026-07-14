import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const Bar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  padding-right: 16px;
  border-right: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

export const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.1;
  white-space: nowrap;
`;

export const Crumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  flex-wrap: wrap;
`;

export const CrumbLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color ${({ theme }) => theme.motion.fast};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 2px 4px;
  margin: -2px -4px;

  &:hover {
    color: ${({ theme }) => theme.colors.brand.primary};
    background: rgba(22, 163, 74, 0.06);
  }
`;

export const CrumbText = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const Sep = styled.span`
  opacity: 0.5;
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const Email = styled.span`
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RoleTag = styled.span<{ $role: "ADMIN" | "OPERADOR" }>`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: capitalize;

  ${({ $role }) =>
    $role === "ADMIN"
      ? css`
          color: #15803d;
          background: rgba(22, 163, 74, 0.12);
        `
      : css`
          color: #2563eb;
          background: rgba(37, 99, 235, 0.12);
        `}
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  position: relative;
  transition:
    background ${({ theme }) => theme.motion.fast},
    color ${({ theme }) => theme.motion.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:active {
    background: rgba(0, 0, 0, 0.08);
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.state.danger};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

export const DropdownWrapper = styled.div`
  position: relative;
`;

export const Dropdown = styled.div<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 180px;
  background: ${({ theme }) => theme.colors.surface.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: 4px;
  z-index: 100;

  ${({ $open }) =>
    $open
      ? css`
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        `
      : css`
          opacity: 0;
          transform: translateY(-4px);
          pointer-events: none;
        `}

  transition:
    opacity ${({ theme }) => theme.motion.fast},
    transform ${({ theme }) => theme.motion.fast};
`;

export const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  text-decoration: none;
  transition:
    background ${({ theme }) => theme.motion.fast},
    color ${({ theme }) => theme.motion.fast};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.motion.fast},
    color ${({ theme }) => theme.motion.fast};

  &:hover {
    background: rgba(220, 38, 38, 0.06);
    color: ${({ theme }) => theme.colors.state.danger};
  }
`;

export const DropdownSeparator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border.subtle};
  margin: 4px 8px;
`;

export const AvatarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.pill};
  transition: opacity ${({ theme }) => theme.motion.fast};

  &:hover {
    opacity: 0.85;
  }
`;
