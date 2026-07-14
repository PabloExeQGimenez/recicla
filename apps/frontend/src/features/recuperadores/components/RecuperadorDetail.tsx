import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useRecuperador from "../hooks/useRecuperador";
import { useToggleActiveRecuperador } from "../hooks/useToggleActiveRecuperador";
import InfoCard from "../../../shared/UI/InfoCard";
import InfoGrid from "../../../shared/UI/InfoGrid";
import InfoRow from "../../../shared/UI/InfoRow";
import { StatusBadge } from "../../../shared/UI";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import { useToast } from "../../../shared/UI/Toast/useToast";
import { formatDate, safe } from "../../../shared/utils/formatters";
import userImg from "../../../assets/images/user.png";
import {
  FaUser,
  FaPhone,
  FaBriefcase,
  FaClock,
  FaMapLocationDot,
  FaEnvelope,
} from "react-icons/fa6";
import {
  Header,
  Profile,
  Avatar,
  ProfileText,
  NameRow,
  Name,
  HeaderActions,
  ActionGhost,
  ActionSolid,
  ErrorBanner,
} from "./DetailStyles";

const ACCENT = {
  personales: "#17315F",
  contacto: "#16A34A",
  operativo: "#2563EB",
  auditoria: "#94A3B8",
} as const;

const RecuperadorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data, refetch } = useRecuperador(id);
  const navigate = useNavigate();
  const { handleToggle, loading: toggleLoading, error: toggleError } = useToggleActiveRecuperador();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toast = useToast();

  const isActive = data?.active !== false;

  const handleToggleActive = () => {
    setConfirmOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!data?.id) return;

    try {
      await handleToggle(data.id, isActive);

      if (isActive) {
        toast.success("Recuperador desactivado con éxito");
        navigate("/recuperadores");
      } else {
        toast.success("Recuperador restaurado con éxito");
        refetch();
      }
    } catch {
      // Error is handled by the hook
    } finally {
      setConfirmOpen(false);
    }
  };

  const fullName = useMemo(() => {
    if (!data) return "";
    return `${safe(data.name)} ${safe(data.lastName)}`
      .replace(" -", "")
      .replace("- ", "")
      .trim();
  }, [data]);

  const status = data?.active === false ? "Inactivo" : "Activo";

  if (!data && !loading && !error) {
    return <p>No se encontró el recuperador</p>;
  }

  if (loading) return <p>Cargando…</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>No se encontró el recuperador</p>;

  return (
    <>
      <Header>
        <Profile>
          <Avatar src={userImg} alt={fullName} aria-hidden />

          <ProfileText>
            <NameRow>
              <Name>{fullName || "Recuperador"}</Name>
              <StatusBadge $variant={data.active === false ? "danger" : "success"}>
                {status}
              </StatusBadge>
            </NameRow>
          </ProfileText>
        </Profile>

        <HeaderActions>
          <ActionGhost
            type="button"
            onClick={() => navigate("/recuperadores")}
          >
            Volver
          </ActionGhost>

          <ActionGhost
            type="button"
            onClick={() => navigate(`/recuperadores/${id}/editar`)}
          >
            Editar
          </ActionGhost>
          {toggleError && <ErrorBanner>{toggleError}</ErrorBanner>}

          <ActionSolid
            type="button"
            onClick={handleToggleActive}
            disabled={toggleLoading}
            $danger={data.active !== false}
          >
            {toggleLoading
              ? "Procesando..."
              : data.active === false
                ? "Restaurar"
                : "Desactivar"}
          </ActionSolid>
        </HeaderActions>
      </Header>

      <InfoGrid columns={2}>
        <InfoCard
          title="Datos personales"
          icon={<FaUser />}
          accentColor={ACCENT.personales}
        >
          <InfoRow label="Nombre" value={safe(data.name)} />
          <InfoRow label="Apellido" value={safe(data.lastName)} />
          <InfoRow label="DNI" value={safe(data.dni)} />
          <InfoRow label="CUIL" value={safe(data.cuil)} />
          <InfoRow
            label="Fecha de nacimiento"
            value={formatDate(data.birthdate)}
          />
        </InfoCard>

        <InfoCard
          title="Contacto"
          icon={<FaPhone />}
          accentColor={ACCENT.contacto}
        >
          <InfoRow
            label="Celular"
            value={safe(data.phone)}
            icon={<FaPhone />}
          />
          <InfoRow
            label="Email"
            value={safe(data.email)}
            icon={<FaEnvelope />}
          />
          <InfoRow
            label="Dirección"
            value={safe(data.address)}
            icon={<FaMapLocationDot />}
          />
        </InfoCard>

        <InfoCard
          title="Operativo"
          icon={<FaBriefcase />}
          accentColor={ACCENT.operativo}
        >
          <InfoRow label="Cuenta" value={safe(data.account)} />
          <InfoRow label="Ruta" value={safe(data.route)} />
          <InfoRow label="Programa" value={safe(data.program)} />
        </InfoCard>

        <InfoCard
          title="Auditoría"
          icon={<FaClock />}
          accentColor={ACCENT.auditoria}
        >
          <InfoRow label="Creado" value={formatDate(data.createdAt)} />
          <InfoRow label="Actualizado" value={formatDate(data.updatedAt)} />
        </InfoCard>
      </InfoGrid>

      <ConfirmDialog
        isOpen={confirmOpen}
        title={isActive ? "Desactivar recuperador" : "Restaurar recuperador"}
        message={
          isActive
            ? "¿Seguro que querés desactivar este recuperador?"
            : "¿Seguro que querés restaurar este recuperador?"
        }
        confirmLabel={isActive ? "Desactivar" : "Restaurar"}
        variant={isActive ? "danger" : "warning"}
        onConfirm={handleConfirmToggle}
        onCancel={() => setConfirmOpen(false)}
        isLoading={toggleLoading}
      />
    </>
  );
};

export default RecuperadorDetail;
