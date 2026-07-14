import { useParams, useNavigate } from "react-router-dom";
import useRecuperador from "../hooks/useRecuperador";
import { recuperadoresService } from "../services";
import toCreateRecuperadorPayload from "../mappers/recuperador.mapper";
import { useToast } from "../../../shared/UI/Toast/useToast";
import RecuperadorForm from "./RecuperadorForm";

const RecuperadorEdit = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { error, loading, data } = useRecuperador(id ?? "");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (formData: Parameters<typeof toCreateRecuperadorPayload>[0]) => {
    if (!id || !data) {
      throw new Error("El id no existe");
    }

    const payload = toCreateRecuperadorPayload(formData);

    const originalPayload = toCreateRecuperadorPayload({
      name: data.name,
      lastName: data.lastName,
      dni: data.dni,
      cuil: data.cuil,
      birthdate: data.birthdate?.slice(0, 10),
      address: data.address,
      phone: data.phone,
      email: data.email,
      account: data.account,
      route: data.route,
      program: data.program,
    });

    if (JSON.stringify(payload) === JSON.stringify(originalPayload)) {
      toast.warning("No se detectaron cambios");
      return;
    }

    const updated = await recuperadoresService.update(id, payload);
    toast.success("Recuperador editado con éxito");
    navigate(`/recuperadores/${updated.id ?? id}`);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>No hay datos para mostrar</p>;
  }

  return (
    <RecuperadorForm
      initialData={data}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      submitLabel="Guardar cambios"
    />
  );
};

export default RecuperadorEdit;
