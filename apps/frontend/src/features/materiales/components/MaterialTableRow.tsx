import styled from "styled-components";
import { StatusBadge } from "../../../shared/UI";
import { FaPencilAlt, FaTrash, FaRedo } from "react-icons/fa";
import type { Material } from "../types/Material";

const TableRow = styled.tr<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
`;

const NameCell = styled.td`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const PriceCell = styled.td`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ActionsCell = styled.td`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const IconButton = styled.button`
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
    color: ${({ theme }) => theme.colors.state.danger};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

interface MaterialTableRowProps {
  material: Material;
  onEdit: (material: Material) => void;
  onDeactivate: (material: Material) => void;
  onActivate: (material: Material) => void;
}

export const MaterialTableRow = ({
  material,
  onEdit,
  onDeactivate,
  onActivate,
}: MaterialTableRowProps) => {
  return (
    <TableRow $active={material.active}>
      <NameCell>{material.name}</NameCell>
      <PriceCell>$ {material.currentPrice}</PriceCell>
      <td>
        <StatusBadge $variant={material.active ? "success" : "danger"}>
          {material.active ? "Activo" : "Inactivo"}
        </StatusBadge>
      </td>
      <ActionsCell>
        {material.active ? (
          <>
            <IconButton
              type="button"
              onClick={() => onEdit(material)}
            >
              <FaPencilAlt />
            </IconButton>
            <IconButton
              type="button"
              onClick={() => onDeactivate(material)}
            >
              <FaTrash />
            </IconButton>
          </>
        ) : (
          <IconButton
            type="button"
            onClick={() => onActivate(material)}
          >
            <FaRedo />
          </IconButton>
        )}
      </ActionsCell>
    </TableRow>
  );
};
