import styled from "styled-components";
import { Input, Select } from "../../../shared/UI";

export const FilterSection = styled.div`
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 0;
`;

export const FilterGroup = styled.div`
  display: grid;
  grid-template-columns: 140px 140px 1fr 180px 150px;
  gap: 12px;
  align-items: end;
`;

export const ButtonsRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 10px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const FieldLabel = styled.label`
  font-size: 11px;
  opacity: 0.65;
  margin-bottom: 4px;
  display: block;
`;

export const DateInput = styled(Input)`
  width: 140px;
  padding: 0 8px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const SearchWrap = styled.div`
  min-width: 0;
`;

export const FilterSelect = styled(Select)`
  padding-right: 32px;
`;

export const LoadingText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const TableBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(0.5)}
    ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.colors.surface.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-bottom: none;
  border-radius: ${({ theme }) => theme.radius.lg}
    ${({ theme }) => theme.radius.lg} 0 0;
`;

export const TotalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(2, 132, 199, 0.08);
  border: 1px solid rgba(2, 132, 199, 0.18);
  color: rgb(2, 132, 199);
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;
`;

export const TablePager = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const DeleteIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  color: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: opacity 150ms ease, color 150ms ease;

  &:hover {
    opacity: 1;
    color: #dc2626;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;
