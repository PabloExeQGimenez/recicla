import styled from "styled-components";
import Table from "../../../shared/UI/Table";
import { formatDate, formatCurrency, formatNumber, capitalize } from "../../../shared/utils/formatters";
import type { SolicitudPagoPreview as SolicitudPagoPreviewType, SolicitudPagoPreviewResumen } from "../types/SolicitudPago";

const SummaryRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.surface.card};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  min-width: 160px;
`;

const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
  padding: ${({ theme }) => theme.spacing(6)};
`;

interface SolicitudPagoPreviewProps {
  preview: SolicitudPagoPreviewType;
  resumen?: SolicitudPagoPreviewResumen;
  pesajes?: SolicitudPagoPreviewType["pesajes"];
}

const agruparPorRecuperador = (
  pesajes: SolicitudPagoPreviewType["pesajes"]
) => {
  const groups = new Map<
    string,
    { recuperador: SolicitudPagoPreviewType["pesajes"][0]["recuperador"]; pesajes: SolicitudPagoPreviewType["pesajes"] }
  >();

  for (const item of pesajes) {
    const recId = item.recuperador.id;
    if (!groups.has(recId)) {
      groups.set(recId, { recuperador: item.recuperador, pesajes: [] });
    }
    groups.get(recId)!.pesajes.push(item);
  }

  return groups;
};

const SolicitudPagoPreview = ({ preview, resumen, pesajes: pesajesOverride }: SolicitudPagoPreviewProps) => {
  const pesajes = pesajesOverride ?? preview.pesajes;
  const displayResumen = resumen ?? preview.resumen;

  if (pesajes.length === 0) {
    return <EmptyMessage>No hay pesajes pendientes en el rango seleccionado</EmptyMessage>;
  }

  const grupos = agruparPorRecuperador(pesajes);

  return (
    <div>
      <SummaryRow>
        <SummaryCard>
          <SummaryLabel>Recuperadores</SummaryLabel>
          <SummaryValue>{displayResumen.cantidadRecuperadores}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Items</SummaryLabel>
          <SummaryValue>{displayResumen.cantidadItems}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Total a pagar</SummaryLabel>
          <SummaryValue>{formatCurrency(displayResumen.totalAPagar)}</SummaryValue>
        </SummaryCard>
      </SummaryRow>

      <Table>
        <thead>
          <tr>
            <th>Recuperador</th>
            <th>Fecha</th>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(grupos.entries()).map(([, group]) =>
            group.pesajes.map((row) => (
              <tr key={`${row.id}-${row.itemId}`}>
                <td style={{ fontWeight: 600 }}>
                  {row.recuperador.nombre} {row.recuperador.apellido}
                </td>
                <td>{formatDate(row.fecha)}</td>
                <td>{capitalize(row.material.nombre)}</td>
                <td>{formatNumber(row.cantidad, "es-AR", 2)} Kg</td>
                <td>{formatCurrency(row.precio)}</td>
                <td style={{ fontWeight: 700 }}>{formatCurrency(row.monto)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SolicitudPagoPreview;
