import React, { forwardRef } from "react";
import styled from "styled-components";

type Spacing = number | string;

interface StyledUlProps {
  $gap?: Spacing;
  $padding?: Spacing;
}

const StyledUl = styled.ul<StyledUlProps>`
  list-style: none;
  margin: 0;
  padding: ${({ $padding }) =>
    typeof $padding === "number" ? `${$padding}px` : ($padding ?? "0")};

  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ $gap, theme }) => {
    if ($gap === undefined) return theme.spacing(1); // default pro
    return typeof $gap === "number" ? `${$gap}px` : $gap;
  }};
`;

export interface UlProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  gap?: Spacing;
  padding?: Spacing;
}

export const Ul = forwardRef<HTMLUListElement, UlProps>(
  ({ children, gap, padding, ...rest }, ref) => {
    return (
      <StyledUl ref={ref} $gap={gap} $padding={padding} {...rest}>
        {children}
      </StyledUl>
    );
  }
);

Ul.displayName = "Ul";

export default Ul;
