import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.surface.card};
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(3)};
  overflow: auto;
  gap: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <StyledContainer className={className} style={style}>
      {children}
    </StyledContainer>
  );
};

export default Container;
