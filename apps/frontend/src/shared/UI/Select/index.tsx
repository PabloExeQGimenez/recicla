import { CSSProperties, ReactNode, ChangeEvent, forwardRef } from "react";
import styled from "styled-components";

const StyledSelect = styled.select`
  width: auto;
  height: 42px;
  padding: 0 ${({ theme }) => theme.spacing(1.5)};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.regular};

  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.surface.card};

  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;

  transition:
    border-color ${({ theme }) => theme.motion.normal},
    box-shadow ${({ theme }) => theme.motion.normal},
    background-color ${({ theme }) => theme.motion.normal};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.border.default};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand.accent};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.brand.accent};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
  }
  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.state.danger};
  }

  &[aria-invalid="true"]:focus-visible {
    border-color: ${({ theme }) => theme.colors.state.danger};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.18);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.surface.app};
    color: ${({ theme }) => theme.colors.text.muted};
    cursor: not-allowed;
    opacity: 0.85;
  }
`;

const StyledOption = styled.option`
  color: ${({ theme }) => theme.colors.text.primary};
`;

export interface SelectProps {
  value?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  children: ReactNode;
  name?: string;
  id?: string;
  style?: CSSProperties;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      value,
      onChange,
      placeholder = "Seleccionar…",
      disabled = false,
      children,
      name,
      id,
      style,
    },
    ref,
  ) => {
    return (
      <StyledSelect
        ref={ref}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={style}
      >
        {placeholder && (
          <StyledOption value="" disabled>
            {placeholder}
          </StyledOption>
        )}
        {children}
      </StyledSelect>
    );
  },
);

Select.displayName = "Select";

export default Select;
