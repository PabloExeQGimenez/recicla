import styled from "styled-components";

export const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing(3)};
  border-top: 3px solid ${({ theme }) => theme.colors.brand.secondary};
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
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

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(2.5)};

  @media (max-width: 899px) {
    grid-template-columns: 1fr;
  }
`;

export const Col = styled.div<{ $span?: number }>`
  grid-column: span ${({ $span = 12 }) => $span};

  @media (max-width: 899px) {
    grid-column: span 1;
  }
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border.subtle};
  margin: ${({ theme }) => theme.spacing(3)} 0;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(1.5)};
`;
