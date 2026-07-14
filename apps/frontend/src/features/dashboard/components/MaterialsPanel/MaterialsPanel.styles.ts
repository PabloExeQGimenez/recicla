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

export const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

export const EmptyState = styled.div`
  border-radius: 22px;
  border: 1px dashed rgba(0, 0, 0, 0.16);
  background: rgba(0, 0, 0, 0.015);
  padding: 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
`;

export const EmptyTitle = styled.div`
  font-weight: 950;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
`;

export const EmptyText = styled.small`
  opacity: 0.75;
  font-weight: 800;
  max-width: 520px;
`;

export const InlineMsg = styled.div`
  opacity: 0.75;
  padding: 2px 0;
  font-weight: 800;
`;
