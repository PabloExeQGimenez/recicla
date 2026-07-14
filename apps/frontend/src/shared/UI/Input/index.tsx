import styled from "styled-components";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const StyledInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 ${({ theme }) => theme.spacing(1.5)};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.surface.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: none;

  transition:
    border-color ${({ theme }) => theme.motion.normal},
    box-shadow ${({ theme }) => theme.motion.normal};

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.brand.accent};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
    outline: none;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.surface.app};
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <StyledInput ref={ref} {...props} />;
});

Input.displayName = "Input";

export default Input;
