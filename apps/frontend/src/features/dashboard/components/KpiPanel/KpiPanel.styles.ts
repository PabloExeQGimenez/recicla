import styled from "styled-components";

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 22px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    0 14px 36px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  padding: 16px 16px;
`;

export const PanelHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 950;
`;

export const PanelHint = styled.small`
  opacity: 0.7;
  font-weight: 800;
`;

export const KpiGrid = styled.div`
  width: 100%;
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(4, minmax(180px, 1fr));

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;
