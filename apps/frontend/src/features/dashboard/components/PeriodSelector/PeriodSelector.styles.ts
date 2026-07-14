import styled from "styled-components";

export const PeriodRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const NavBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 950;
  font-size: 14px;
  cursor: pointer;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const Select = styled.select`
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.95);
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 700;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: rgba(16, 185, 129, 0.65);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
  }
`;

export const PeriodLabel = styled.span`
  font-weight: 800;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
  opacity: 0.8;
  min-width: 120px;
  text-align: center;
`;
