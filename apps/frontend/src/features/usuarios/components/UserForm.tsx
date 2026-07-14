import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/UI/Button";
import Input from "../../../shared/UI/Input";
import Select from "../../../shared/UI/Select";
import FormField from "../../../shared/UI/FormField";
import { ConfirmDialog } from "../../../shared/UI/ConfirmDialog";
import { userFormSchema, type UserFormValues } from "../validations/user.schema";
import { usuariosService } from "../services/usuarios.service";
import {
  Card,
  TitleRow,
  ErrorBanner,
  FormGrid,
  Col,
  Divider,
  Actions,
} from "./UserFormStyles";

const INITIAL_FORM: UserFormValues = {
  name: "",
  lastName: "",
  dni: "",
  email: "",
  password: "",
  role: "OPERADOR",
};

const UserForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserFormValues>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const result = userFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await usuariosService.create(form);
      setShowSuccess(true);
    } catch (err) {
      if (err instanceof Error) setSubmitError(err.message);
      else setSubmitError("No se pudo crear el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSuccessConfirm = () => {
    setShowSuccess(false);
    navigate("/usuarios");
  };

  return (
    <Card>
      <TitleRow>
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
        >
          Volver
        </Button>
      </TitleRow>

      {submitError && <ErrorBanner>{submitError}</ErrorBanner>}

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <Col $span={4}>
            <FormField label="Nombre" htmlFor="name" required>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Juan"
                required
              />
              {errors.name && <ErrorBanner>{errors.name}</ErrorBanner>}
            </FormField>
          </Col>

          <Col $span={4}>
            <FormField label="Apellido" htmlFor="lastName" required>
              <Input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Ej: Pérez"
                required
              />
              {errors.lastName && <ErrorBanner>{errors.lastName}</ErrorBanner>}
            </FormField>
          </Col>

          <Col $span={4}>
            <FormField label="DNI" htmlFor="dni">
              <Input
                id="dni"
                name="dni"
                value={form.dni ?? ""}
                onChange={handleChange}
                inputMode="numeric"
                placeholder="Ej: 34857963"
              />
              {errors.dni && <ErrorBanner>{errors.dni}</ErrorBanner>}
            </FormField>
          </Col>

          <Col $span={6}>
            <FormField label="Email" htmlFor="email" required>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nombre@mail.com"
                required
              />
              {errors.email && <ErrorBanner>{errors.email}</ErrorBanner>}
            </FormField>
          </Col>

          <Col $span={6}>
            <FormField label="Contraseña" htmlFor="password" required>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
              {errors.password && <ErrorBanner>{errors.password}</ErrorBanner>}
            </FormField>
          </Col>

          <Col $span={4}>
            <FormField label="Rol" htmlFor="role" required>
              <Select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="OPERADOR">Operador</option>
                <option value="ADMIN">Administrador</option>
              </Select>
              {errors.role && <ErrorBanner>{errors.role}</ErrorBanner>}
            </FormField>
          </Col>
        </FormGrid>

        <Divider />

        <Actions>
          <Button type="button" variant="ghost" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear usuario"}
          </Button>
        </Actions>
      </form>

      <ConfirmDialog
        isOpen={showSuccess}
        title="Usuario creado"
        message="El usuario se creó correctamente."
        confirmLabel="Aceptar"
        variant="info"
        onConfirm={handleSuccessConfirm}
        onCancel={handleSuccessConfirm}
      />
    </Card>
  );
};

export default UserForm;
