import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUsuario from "../hooks/useUsuario";
import { usuariosService } from "../services/usuarios.service";
import { useAuth } from "../../../shared/auth/useAuth";
import InfoCard from "../../../shared/UI/InfoCard";
import InfoGrid from "../../../shared/UI/InfoGrid";
import InfoRow from "../../../shared/UI/InfoRow";
import { StatusBadge } from "../../../shared/UI";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import { formatDate, safe } from "../../../shared/utils/formatters";
import { FaUser, FaShieldHalved, FaDatabase, FaTrash } from "react-icons/fa6";
import {
  Header,
  Profile,
  Avatar,
  ProfileText,
  NameRow,
  Name,
  Email,
  HeaderActions,
  ActionGhost,
  ActionSolid,
  ErrorBanner,
  ChipGrid,
  PermissionChip,
} from "./UsuarioDetailStyles";

const ROLE_PERMISSIONS: Record<string, { label: string; allowed: boolean }[]> = {
  ADMIN: [
    { label: "Ver dashboard", allowed: true },
    { label: "Cargar pesajes", allowed: true },
    { label: "Ver pesajes", allowed: true },
    { label: "Ver recuperadores", allowed: true },
    { label: "Crear recuperadores", allowed: true },
    { label: "Editar recuperadores", allowed: true },
    { label: "Desactivar recuperadores", allowed: true },
    { label: "Ver materiales", allowed: true },
    { label: "Crear materiales", allowed: true },
    { label: "Editar materiales", allowed: true },
    { label: "Activar/desactivar materiales", allowed: true },
    { label: "Crear pagos", allowed: true },
    { label: "Ver pagos", allowed: true },
    { label: "Marcar pagos como pagados", allowed: true },
    { label: "Excluir pesajes de pagos", allowed: true },
    { label: "Crear usuarios", allowed: true },
    { label: "Ver lista de usuarios", allowed: true },
  ],
  OPERADOR: [
    { label: "Ver dashboard", allowed: true },
    { label: "Cargar pesajes", allowed: true },
    { label: "Ver pesajes", allowed: true },
    { label: "Ver recuperadores", allowed: true },
    { label: "Crear recuperadores", allowed: false },
    { label: "Editar recuperadores", allowed: false },
    { label: "Desactivar recuperadores", allowed: false },
    { label: "Ver materiales", allowed: true },
    { label: "Crear materiales", allowed: false },
    { label: "Editar materiales", allowed: false },
    { label: "Activar/desactivar materiales", allowed: false },
    { label: "Crear pagos", allowed: false },
    { label: "Ver pagos", allowed: true },
    { label: "Marcar pagos como pagados", allowed: false },
    { label: "Excluir pesajes de pagos", allowed: false },
    { label: "Crear usuarios", allowed: false },
    { label: "Ver lista de usuarios", allowed: false },
  ],
};

const UsuarioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useUsuario(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!data?.id) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await usuariosService.delete(data.id);
      navigate("/usuarios");
    } catch (err) {
      if (err instanceof Error) setDeleteError(err.message);
      else setDeleteError("No se pudo eliminar el usuario");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (!data && !loading && !error) {
    return <p>No se encontró el usuario</p>;
  }

  if (loading) return <p>Cargando…</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>No se encontró el usuario</p>;

  const permissions = ROLE_PERMISSIONS[data.role] ?? [];
  const allowedCount = permissions.filter((p) => p.allowed).length;

  return (
    <>
      <Header>
        <Profile>
          <Avatar $role={data.role}>
            <FaUser />
          </Avatar>

          <ProfileText>
            <NameRow>
              <Name>{safe(data.name)} {safe(data.lastName)}</Name>
              <StatusBadge $variant={data.role === "ADMIN" ? "success" : "info"}>
                {data.role === "ADMIN" ? "Administrador" : "Operador"}
              </StatusBadge>
            </NameRow>
            <Email>{safe(data.email)}</Email>
          </ProfileText>
        </Profile>

        <HeaderActions>
          <ActionGhost
            type="button"
            onClick={() => navigate("/usuarios")}
          >
            Volver
          </ActionGhost>

          {user?.id !== data.id && (
            <ActionSolid
              type="button"
              $danger
              onClick={() => setConfirmOpen(true)}
            >
              <FaTrash size={13} /> Eliminar
            </ActionSolid>
          )}
        </HeaderActions>
      </Header>

      {deleteError && <ErrorBanner>{deleteError}</ErrorBanner>}

      <InfoGrid columns={2}>
        <InfoCard
          title="Datos personales"
          icon={<FaUser />}
          accentColor="#17315F"
        >
          <InfoRow label="Nombre" value={safe(data.name)} />
          <InfoRow label="Apellido" value={safe(data.lastName)} />
          <InfoRow label="DNI" value={safe(data.dni)} />
          <InfoRow label="Email" value={safe(data.email)} />
        </InfoCard>

        <InfoCard
          title="Rol y permisos"
          icon={<FaShieldHalved />}
          accentColor={data.role === "ADMIN" ? "#16A34A" : "#0284C7"}
          subtitle={`${allowedCount} de ${permissions.length} permisos activos`}
        >
          <ChipGrid>
            {permissions.map((perm) => (
              <PermissionChip key={perm.label} $allowed={perm.allowed}>
                {perm.label}
              </PermissionChip>
            ))}
          </ChipGrid>
        </InfoCard>

        <InfoCard
          title="Cuenta"
          icon={<FaDatabase />}
          accentColor="#94A3B8"
        >
          <InfoRow label="ID" value={safe(data.id)} />
          <InfoRow label="Creado el" value={formatDate(data.createdAt)} />
        </InfoCard>
      </InfoGrid>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Eliminar usuario"
        message="¿Eliminar este usuario? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        isLoading={deleting}
      />
    </>
  );
};

export default UsuarioDetail;
