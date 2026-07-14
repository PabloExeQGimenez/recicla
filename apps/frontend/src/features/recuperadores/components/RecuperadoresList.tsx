import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useRecuperadores from "../hooks/useRecuperadores";
import { useAuth } from "../../../shared/auth/useAuth";
import {
  PageHeader,
  PageHeaderLeft,
  PageHeaderRight,
  Container,
  Button,
  Input,
  Table,
  Select,
  StatusBadge,
} from "../../../shared/UI";
import { FaMagnifyingGlass, FaInbox, FaArrowRight } from "react-icons/fa6";
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

const FilterDivider = styled.span`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.border.default};
  flex-shrink: 0;
`;

const FilterSelect = styled(Select)`
  width: 60px;
  padding-right: 32px;
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

const CenteredTh = styled.th`
  text-align: center;
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

const RecuperadoresList = () => {
  const {
    loading,
    error,
    recuperadores,
    totalPages,
    total,
    page,
    setPage,
    setSearch,
    active,
    setActive,
    refetch,
  } = useRecuperadores();

  const [qInput, setQInput] = useState("");
  const debouncedSearch = useDebounce(qInput, 300);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    setSearch(debouncedSearch.trim());
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [active, page, setPage]);

  const statsLabel = useMemo(() => {
    const showing = recuperadores.length;
    if (showing === total) {
      return `${total} recuperador${total !== 1 ? "es" : ""}`;
    }
    return `${showing} de ${total} recuperadores`;
  }, [recuperadores.length, total]);

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
              placeholder="Buscar nombre, apellido o dni..."
              onChange={(e) => {
                setQInput(e.target.value);
                if (page !== 1) setPage(1);
              }}
            />
          </SearchWrapper>

          <FilterDivider />

          <FilterSelect
            value={active === undefined ? "all" : String(active)}
            onChange={(e) => {
              const v = e.target.value;
              setActive(v === "all" ? undefined : v === "true");
            }}
          >
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
            <option value="all">Todos</option>
          </FilterSelect>

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
            onClick={refetch}
            disabled={loading}
          >
            Actualizar
          </Button>

          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => navigate("/recuperadores/crear")}
            >
              + Agregar recuperador
            </Button>
          )}
        </PageHeaderRight>
      </PageHeader>

      <div>
        <TableBar>
          {!loading && recuperadores.length > 0 && (
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
              <th>Recuperador</th>
              <th>DNI</th>
              <th>Celular</th>
              <CenteredTh>Estado</CenteredTh>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recuperadores.map(
              ({ name, lastName, dni, id, phone, active: recActive }) => (
                <tr key={id}>
                  <td style={{ fontWeight: 600 }}>{name} {lastName}</td>
                  <td>{dni || "-"}</td>
                  <td>{phone || "-"}</td>
                  <td>
                    <StatusBadge $variant={recActive ? "success" : "danger"}>
                      {recActive ? "Activo" : "Inactivo"}
                    </StatusBadge>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <IconButton
                      type="button"
                      onClick={() => navigate(`/recuperadores/${id}`)}
                    >
                      Ver <FaArrowRight size={12} />
                    </IconButton>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>

        {!loading && recuperadores.length === 0 && (
          <EmptyState>
            <EmptyIcon>
              <FaInbox />
            </EmptyIcon>
            <EmptyText>No se encontraron recuperadores</EmptyText>
            {qInput && (
              <EmptyHint>{`No hay resultados para "${qInput}"`}</EmptyHint>
            )}
          </EmptyState>
        )}
      </div>
    </Container>
  );
};

export default RecuperadoresList;
