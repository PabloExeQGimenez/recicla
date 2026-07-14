import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useUsuarios from "../hooks/useUsuarios";
import { useAuth } from "../../../shared/auth/useAuth";
import {
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  Container,
  Button,
  Input,
  Table,
  StatusBadge,
} from "../../../shared/UI";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import { FaMagnifyingGlass, FaInbox, FaArrowRight, FaUserPlus, FaTrash } from "react-icons/fa6";
import { useDebounce } from "../../../shared/hooks/useDebounce";

const SearchWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  pointer-events: none;
`;

const SearchInput = styled(Input)`
  width: 320px;
  padding-left: 36px;
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.state.danger};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
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

const CountBadge = styled.span`
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

const TablePager = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(22, 163, 74, 0.08);
  border: 1px solid rgba(22, 163, 74, 0.2);
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.state.success};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  transition: background 150ms ease, border-color 150ms ease;

  &:hover {
    background: rgba(22, 163, 74, 0.15);
    border-color: rgba(22, 163, 74, 0.35);
  }
`;

const DeleteIcon = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.state.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: background 150ms ease, border-color 150ms ease;

  &:hover {
    background: rgba(220, 38, 38, 0.15);
    border-color: rgba(220, 38, 38, 0.35);
  }
`;

const ActionsCell = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  padding: ${({ theme }) => theme.spacing(4)} 0;
  color: ${({ theme }) => theme.colors.text.muted};
`;

const EmptyIcon = styled.span`
  font-size: 32px;
  opacity: 0.5;
`;

const EmptyText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const EmptyHint = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.7;
`;

const UsuariosList = () => {
  const {
    loading,
    error,
    usuarios,
    totalPages,
    total,
    page,
    setPage,
    search,
    setSearch,
    remove,
  } = useUsuarios();

  const [qInput, setQInput] = useState("");
  const debouncedSearch = useDebounce(qInput, 300);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    setSearch(debouncedSearch.trim());
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [search, page, setPage]);

  const statsLabel =
    total === usuarios.length
      ? `${total} usuario${total !== 1 ? "s" : ""}`
      : `${usuarios.length} de ${total} usuarios`;

  const getRoleVariant = (role: string): "success" | "info" =>
    role === "ADMIN" ? "success" : "info";

  const getRoleLabel = (role: string): string =>
    role === "ADMIN" ? "Administrador" : "Operador";

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget);
    } catch {
      // error handled by hook
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <Container>
      <PageHeader>
        <PageHeaderLeft>
          <SearchWrapper>
            <SearchIcon>
              <FaMagnifyingGlass />
            </SearchIcon>
            <SearchInput
              type="text"
              value={qInput}
              placeholder="Buscar nombre, apellido, email o DNI..."
              onChange={(e) => {
                setQInput(e.target.value);
                if (page !== 1) setPage(1);
              }}
            />
          </SearchWrapper>

          {loading && (
            <span style={{ fontSize: 14, color: "#94A3B8" }}>Cargando...</span>
          )}

          {error && <ErrorText>{error}</ErrorText>}
        </PageHeaderLeft>

        <PageHeaderRight>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => {}}
            disabled={loading}
          >
            Actualizar
          </Button>

          <Button
            variant="primary"
            onClick={() => navigate("/usuarios/crear")}
          >
            <FaUserPlus />
            Crear usuario
          </Button>
        </PageHeaderRight>
      </PageHeader>

      <div>
        <TableBar>
          {!loading && usuarios.length > 0 && (
            <CountBadge>{statsLabel}</CountBadge>
          )}

          <TablePager>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>

            <span>{`${page} / ${totalPages || 1}`}</span>

            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={page >= totalPages || loading || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </TablePager>
        </TableBar>

        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>DNI</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>
                  {u.name} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>{u.dni || "—"}</td>
                <td>
                  <StatusBadge $variant={getRoleVariant(u.role)}>
                    {getRoleLabel(u.role)}
                  </StatusBadge>
                </td>
                <td style={{ textAlign: "right" }}>
                  <ActionsCell>
                    <IconButton type="button" onClick={() => navigate(`/usuarios/${u.id}`)}>
                      Ver <FaArrowRight size={12} />
                    </IconButton>
                    {user?.id !== u.id && (
                      <DeleteIcon
                        type="button"
                        title="Eliminar usuario"
                        onClick={() => setDeleteTarget(u.id)}
                      >
                        <FaTrash size={13} />
                      </DeleteIcon>
                    )}
                  </ActionsCell>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {!loading && usuarios.length === 0 && (
          <EmptyState>
            <EmptyIcon>
              <FaInbox />
            </EmptyIcon>
            <EmptyText>No se encontraron usuarios</EmptyText>
            {qInput && (
              <EmptyHint>{`No hay resultados para "${qInput}"`}</EmptyHint>
            )}
          </EmptyState>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Eliminar usuario"
        message="¿Eliminar este usuario? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Container>
  );
};

export default UsuariosList;
