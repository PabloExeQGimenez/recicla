import { ReactNode, FC, CSSProperties } from "react";
import styled from "styled-components";

export const StyledLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};

  margin-bottom: 6px;
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.state.danger};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1;
`;

export interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  style?: CSSProperties;
  required?: boolean;
}

const Label: FC<LabelProps> = ({ children, htmlFor, style, required }) => {
  return (
    <StyledLabel htmlFor={htmlFor} style={style}>
      {children}
      {required ? <RequiredMark aria-hidden="true">*</RequiredMark> : null}
    </StyledLabel>
  );
};

export default Label;
