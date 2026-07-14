import styled from "styled-components";
import { InfoCard, Button } from "../../../shared/UI";

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(420px, 520px) 1fr;
  gap: 14px;
  align-items: start;
`;

export const CargaPanel = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border-radius: 20px;
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(16, 185, 129, 0.1) 0%,
    rgba(16, 185, 129, 0.03) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  box-shadow: inset 4px 0 0 rgba(16, 185, 129, 0.85),
    0 10px 28px rgba(16, 185, 129, 0.1), 0 6px 18px rgba(0, 0, 0, 0.04);
  transition: all 180ms ease;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(16,185,129,0.42)" : "rgba(16,185,129,0.20)"};
  overflow: visible;

  ${({ $active }) =>
    $active &&
    `
    box-shadow: inset 4px 0 0 rgba(16,185,129,0.95),
      0 16px 40px rgba(16,185,129,0.18), 0 10px 26px rgba(0,0,0,0.06);
    transform: translateY(-1px);
  `}
`;

export const CargaPanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 14px;
  }
`;

export const CardInPanel = styled(InfoCard)<{ $active: boolean }>`
  border: 1px solid rgba(16, 185, 129, 0.18);
  box-shadow: 0 10px 26px rgba(16, 185, 129, 0.08);
  border-radius: 18px;

  ${({ $active }) =>
    $active &&
    `
    border-color: rgba(16,185,129,0.30);
    box-shadow: 0 14px 34px rgba(16,185,129,0.14), 0 10px 26px rgba(0,0,0,0.06);
  `}
`;

export const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const MaterialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 140px;
  gap: 12px;
  align-items: end;
`;

export const FieldGroup = styled.div<{ $flex?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ $flex }) => $flex && "min-width: 0;"}
`;

export const FieldLabel = styled.label`
  font-size: 12px;
  opacity: 0.78;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const KeyHint = styled.kbd`
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.04);
  font-family: inherit;
  font-weight: 600;
  opacity: 0.5;
  line-height: 1;
`;

export const MessagesRow = styled.div`
  grid-column: 1 / -1;
  margin-top: 6px;
`;

export const SuccessBox = styled.div`
  border: 1px solid rgba(22, 163, 74, 0.24);
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
`;

export const ErrorBox = styled.div`
  border: 1px solid rgba(220, 38, 38, 0.22);
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
`;

export const MaterialSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const AddButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const ClearButton = styled(Button)`
  opacity: 0.55;
  transition: opacity 150ms ease;

  &:hover {
    opacity: 1;
  }
`;

export const SubtotalContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

export const SubtotalLabel = styled.span`
  font-size: 13px;
  opacity: 0.72;
`;

export const SubtotalValue = styled.strong`
  font-size: 16px;
`;

export const DetailCard = styled(InfoCard)`
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.04);
`;

export const ShortcutsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 2px;
`;

export const ShortcutsAnchor = styled.div`
  position: relative;
`;

export const FechaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input[type="date"] {
    width: 180px;
  }
`;


