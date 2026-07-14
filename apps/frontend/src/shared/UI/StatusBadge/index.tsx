import styled, { css } from "styled-components";

type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral";

const variantStyles: Record<BadgeVariant, ReturnType<typeof css>> = {
  success: css`
    color: #15803d;
    background: rgba(22, 163, 74, 0.12);
    border-color: rgba(22, 163, 74, 0.24);
  `,
  danger: css`
    color: #dc2626;
    background: rgba(220, 38, 38, 0.1);
    border-color: rgba(220, 38, 38, 0.22);
  `,
  warning: css`
    color: #b45309;
    background: rgba(245, 158, 11, 0.12);
    border-color: rgba(245, 158, 11, 0.24);
  `,
  info: css`
    color: #2563eb;
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.22);
  `,
  neutral: css`
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) =>
      theme.colors.bg?.muted ?? "rgba(0,0,0,0.06)"};
    border-color: transparent;
  `,
};

export const StatusBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid transparent;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-transform: capitalize;
  white-space: nowrap;

  ${({ $variant }) => variantStyles[$variant]}
`;
