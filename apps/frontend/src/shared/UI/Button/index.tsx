import React from "react";
import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const sizeStyles: Record<ButtonSize, ReturnType<typeof css>> = {
  sm: css`
    height: 32px;
    padding: 0 ${({ theme }) => theme.spacing(1.25)};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    border-radius: ${({ theme }) => theme.radius.sm};
  `,
  md: css`
    height: 40px;
    padding: 0 ${({ theme }) => theme.spacing(1.5)};
    font-size: ${({ theme }) => theme.fontSizes.md};
    border-radius: ${({ theme }) => theme.radius.md};
  `,
  lg: css`
    height: 48px;
    padding: 0 ${({ theme }) => theme.spacing(2)};
    font-size: ${({ theme }) => theme.fontSizes.md};
    border-radius: ${({ theme }) => theme.radius.md};
  `,
};

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    border: 1px solid transparent;

    &:hover {
      filter: brightness(0.95);
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface.app};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border.default};

    &:hover {
      background: ${({ theme }) => theme.colors.surface.card};
      border-color: ${({ theme }) => theme.colors.brand.secondary};
    }
  `,

  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid transparent;

    &:hover {
      background: ${({ theme }) => theme.colors.surface.app};
      border-color: ${({ theme }) => theme.colors.border.subtle};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.state.danger};
    color: ${({ theme }) => theme.colors.text.inverse};
    border: 1px solid transparent;

    &:hover {
      filter: brightness(0.95);
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }
  `,
};

export const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: 1;
  cursor: pointer;
  user-select: none;

  transition:
    background ${({ theme }) => theme.motion.normal},
    border-color ${({ theme }) => theme.motion.normal},
    box-shadow ${({ theme }) => theme.motion.normal},
    transform ${({ theme }) => theme.motion.fast},
    opacity ${({ theme }) => theme.motion.fast};

  ${(props) => sizeStyles[props.$size]}
  ${(props) => variantStyles[props.$variant]}

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Accesibilidad: focus visible (tab) */
  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  }
`;

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;

  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled,
  style,
  className,
  variant = "secondary",
  size = "md",
  fullWidth = false,
}) => {
  return (
    <StyledButton
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={style}
      className={className}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
