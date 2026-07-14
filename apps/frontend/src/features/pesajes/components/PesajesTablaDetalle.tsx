import { useState } from "react";
import styled from "styled-components";
import { Button, Table } from "../../../shared/UI";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import { FaTrash } from "react-icons/fa";
import { capitalize } from "../../../shared/utils/formatters";
import type { PesajeLineValues } from "../validations/pesaje.schema";

interface PesajesTablaDetalleProps {
  items: PesajeLineValues[];
  totalGeneral: number;
  onRemoveLine: (tempId: string) => void;
  submitting: boolean;
  onSubmit: () => void;
  canSubmit: boolean;
}

export const PesajesTablaDetalle = ({
  items,
  totalGeneral,
  onRemoveLine,
  submitting,
  onSubmit,
  canSubmit,
}: PesajesTablaDetalleProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const handleRemoveRequest = (tempId: string) => {
    setPendingRemoveId(tempId);
    setConfirmOpen(true);
  };

  const handleConfirmRemove = () => {
    if (pendingRemoveId) {
      onRemoveLine(pendingRemoveId);
    }
    setPendingRemoveId(null);
    setConfirmOpen(false);
  };

  const handleCancelRemove = () => {
    setPendingRemoveId(null);
    setConfirmOpen(false);
  };

  const pendingItem = items.find((it) => it.tempId === pendingRemoveId);

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HeaderTitle>Detalle</HeaderTitle>
          <HeaderSubtitle>Items: {items.length}</HeaderSubtitle>
          <TotalContainer>
            <TotalLabel>Total</TotalLabel>
            <TotalValue>${totalGeneral}</TotalValue>
          </TotalContainer>
        </HeaderLeft>

        <SaveButton
          variant="primary"
          type="button"
          onClick={onSubmit}
          disabled={submitting || !canSubmit}
        >
          {submitting ? "Guardando..." : "Guardar carga"}
          <KeyHint>Alt+↵</KeyHint>
        </SaveButton>
      </Header>

      <TableShell>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Material</th>
                <th style={{ textAlign: "right" }}>Cantidad</th>
                <th style={{ textAlign: "right" }}>Precio</th>
                <th style={{ textAlign: "right" }}>Subtotal</th>
                <th style={{ textAlign: "right" }}>Quitar</th>
                <th style={{ width: 1 }} />
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 14, opacity: 0.7 }}>
                    Todavía no agregaste líneas.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.tempId}>
                    <td>{capitalize(item.materialLabel)}</td>
                    <td style={{ textAlign: "right" }}>{item.cantidad} Kg</td>
                    <td style={{ textAlign: "right" }}>${item.precio}</td>
                    <td style={{ textAlign: "right" }}>${item.subtotal}</td>
                    <td style={{ textAlign: "right" }}>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveRequest(item.tempId)}
                        disabled={submitting}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableScroll>
      </TableShell>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Quitar línea"
        message={
          pendingItem
            ? `¿Quitar ${capitalize(pendingItem.materialLabel)} (${pendingItem.cantidad} Kg) del detalle?`
            : "¿Quitar esta línea del detalle?"
        }
        confirmLabel="Quitar"
        variant="danger"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const HeaderTitle = styled.strong`
  font-size: 14px;
`;

const HeaderSubtitle = styled.span`
  font-size: 12px;
  opacity: 0.7;
`;

const TotalContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const TotalLabel = styled.span`
  font-size: 12px;
  opacity: 0.7;
`;

const TotalValue = styled.strong`
  font-size: 18px;
`;

const TableShell = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
`;

const TableScroll = styled.div`
  max-height: 520px;
  overflow-y: auto;
  background: transparent;
`;

const SaveButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const KeyHint = styled.kbd`
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.15);
  font-family: inherit;
  font-weight: 600;
  opacity: 0.7;
  line-height: 1;
`;
