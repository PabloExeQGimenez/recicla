import { useMemo, useState } from "react";
import styled from "styled-components";
import { useMateriales } from "../hooks/useMateriales";
import { useMaterialModal } from "../hooks/useMaterialModal";
import { useMaterialConfirm } from "../hooks/useMaterialConfirm";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useAuth } from "../../../shared/auth/useAuth";
import Container from "../../../shared/UI/Container";
import { Table, LoadingSpinner } from "../../../shared/UI";
import Button from "../../../shared/UI/Button";
import PageHeader, {
  PageHeaderLeft,
  PageHeaderRight,
} from "../../../shared/UI/PageHeader";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import { MaterialSearchBar } from "./MaterialSearchBar";
import { MaterialTableRow } from "./MaterialTableRow";
import { MaterialFormModal } from "./MaterialFormModal";

const EmptyMessage = styled.div`
  padding: ${({ theme }) => theme.spacing(2)} 0;
  opacity: 0.8;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TableBar = styled.div`
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

const TotalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(2, 132, 199, 0.08);
  border: 1px solid rgba(2, 132, 199, 0.18);
  color: rgb(2, 132, 199);
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  white-space: nowrap;
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.state.danger};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const MaterialesList = () => {
  const { materiales, loading, error, setMateriales } = useMateriales();
  const modal = useMaterialModal(setMateriales);
  const confirm = useMaterialConfirm(setMateriales);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const debouncedSearch = useDebounce(searchTerm, 300);

  const materialesFiltrados = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return materiales;
    return materiales.filter((m) => m.name.toLowerCase().includes(q));
  }, [materiales, debouncedSearch]);

  return (
    <Container>
      <PageHeader>
        <PageHeaderLeft>
          <MaterialSearchBar value={searchTerm} onChange={setSearchTerm} />
          {error && <ErrorText>{error}</ErrorText>}
          {loading && <LoadingSpinner text="Cargando..." />}
        </PageHeaderLeft>

        <PageHeaderRight>
          {isAdmin && (
            <Button variant="primary" type="button" onClick={modal.openCreate}>
              + Agregar material
            </Button>
          )}
        </PageHeaderRight>
      </PageHeader>

      <TableBar>
        {!loading && materialesFiltrados.length > 0 && (
          <TotalBadge>
            <span>{materialesFiltrados.length}</span> materiales
          </TotalBadge>
        )}
      </TableBar>

      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materialesFiltrados.map((mat) => (
            <MaterialTableRow
              key={mat.id}
              material={mat}
              onEdit={modal.openEdit}
              onDeactivate={confirm.handleDeactivate}
              onActivate={confirm.handleActivate}
            />
          ))}
        </tbody>
      </Table>

      {!loading && materialesFiltrados.length === 0 && (
        <EmptyMessage>
          No se encontraron materiales{" "}
          {searchTerm ? `para "${searchTerm}"` : ""}
        </EmptyMessage>
      )}

      <MaterialFormModal
        isOpen={modal.isModalOpen}
        onClose={modal.closeModal}
        material={modal.editMaterial}
        onSubmit={modal.handleSubmit}
      />

      <ConfirmDialog
        isOpen={!!confirm.confirmAction}
        title={
          confirm.confirmAction?.type === "deactivate"
            ? "Desactivar material"
            : "Reactivar material"
        }
        message={
          confirm.confirmAction?.type === "deactivate"
            ? `¿Seguro que querés desactivar "${confirm.confirmAction?.material.name}"?`
            : `¿Seguro que querés reactivar "${confirm.confirmAction?.material.name}"?`
        }
        confirmLabel={
          confirm.confirmAction?.type === "deactivate"
            ? "Desactivar"
            : "Reactivar"
        }
        variant={
          confirm.confirmAction?.type === "deactivate" ? "danger" : "warning"
        }
        onConfirm={confirm.handleConfirm}
        onCancel={confirm.handleCancelConfirm}
      />
    </Container>
  );
};

export default MaterialesList;
