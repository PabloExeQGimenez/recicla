import styled from "styled-components";
import { ReactNode, FC } from "react";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};

  thead {
    background: ${({ theme }) => theme.colors.surface.app};
  }

  th {
    text-align: left;
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    padding: ${({ theme }) => theme.spacing(1)};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
    color: ${({ theme }) => theme.colors.text.secondary};
    white-space: nowrap;
  }

  td {
    padding: ${({ theme }) => theme.spacing(0.5)};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  }

  tbody tr {
    transition: background ${({ theme }) => theme.motion.fast};
  }

  tbody tr:hover {
    background: rgba(0, 0, 0, 0.03);
  }
`;

export interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table: FC<TableProps> = ({ children, className }) => {
  return <StyledTable className={className}>{children}</StyledTable>;
};

export default Table;
