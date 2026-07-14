import { useNavigate } from "react-router-dom";
import { recuperadoresService } from "../services/recuperadores.service";
import toCreateRecuperadorPayload from "../mappers/recuperador.mapper";
import { useToast } from "../../../shared/UI/Toast/useToast";
import RecuperadorForm from "./RecuperadorForm";

export const RecuperadorCreate = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (data: Parameters<typeof toCreateRecuperadorPayload>[0]) => {
    const payload = toCreateRecuperadorPayload(data);
    const created = await recuperadoresService.create(payload);
    toast.success("Recuperador creado con éxito");
    navigate(`/recuperadores/${created.id}`);
  };

  return (
    <RecuperadorForm
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      submitLabel="Crear"
    />
  );
};

export default RecuperadorCreate;
