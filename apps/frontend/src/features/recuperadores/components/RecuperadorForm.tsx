import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../shared/UI/Button";
import Input from "../../../shared/UI/Input";
import Select from "../../../shared/UI/Select";
import FormField from "../../../shared/UI/FormField";
import ProgramasSociales from "../../../enums/ProgramasSociales";
import { recuperadorFormSchema } from "../validations/recuperador.schema";
import {
  Card,
  TitleRow,
  ErrorBanner,
  FormGrid,
  Col,
  Divider,
  Actions,
} from "./FormStyles";

interface RecuperadorFormProps {
  initialData?: {
    name: string;
    lastName: string;
    dni?: string;
    cuil?: string;
    birthdate?: string;
    address?: string;
    phone?: string;
    email?: string;
    account?: string;
    route?: string;
    program?: string;
  } | null;
  onSubmit: (data: {
    name: string;
    lastName: string;
    dni?: string;
    cuil?: string;
    birthdate?: string;
    address?: string;
    phone?: string;
    email?: string;
    account?: string;
    route?: string;
    program?: string;
  }) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const INITIAL_FORM = {
  name: "",
  lastName: "",
  dni: "",
  cuil: "",
  birthdate: "",
  address: "",
  phone: "",
  account: "",
  route: "",
  email: "",
  program: "",
};

const RecuperadorForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Crear",
}: RecuperadorFormProps) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        lastName: initialData.lastName ?? "",
        dni: initialData.dni ?? "",
        cuil: initialData.cuil ?? "",
        birthdate: initialData.birthdate ? initialData.birthdate.slice(0, 10) : "",
        address: initialData.address ?? "",
        phone: initialData.phone ?? "",
        account: initialData.account ?? "",
        route: initialData.route ?? "",
        email: initialData.email ?? "",
        program: initialData.program ?? "",
      });
    }
  }, [initialData]);

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
    const result = recuperadorFormSchema.safeParse(form);
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
      const result = recuperadorFormSchema.parse(form);
      await onSubmit(result);
    } catch (err) {
      if (err instanceof Error) setSubmitError(err.message);
      else setSubmitError("No se pudo guardar el recuperador");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
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
                  placeholder="Ej: José"
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
                  placeholder="Ej: De San Martín"
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
                  value={form.dni}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="Ej: 34857963"
                />
                {errors.dni && <ErrorBanner>{errors.dni}</ErrorBanner>}
              </FormField>
            </Col>

            <Col $span={4}>
              <FormField label="CUIL" htmlFor="cuil">
                <Input
                  id="cuil"
                  name="cuil"
                  value={form.cuil}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="Ej: 20348579689"
                />
                {errors.cuil && <ErrorBanner>{errors.cuil}</ErrorBanner>}
              </FormField>
            </Col>

            <Col $span={4}>
              <FormField label="Nacimiento" htmlFor="birthdate">
                <Input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  value={form.birthdate}
                  onChange={handleChange}
                />
                {errors.birthdate && <ErrorBanner>{errors.birthdate}</ErrorBanner>}
              </FormField>
            </Col>

            <Col $span={4}>
              <FormField label="Dirección" htmlFor="address">
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Calle y número"
                />
                {errors.address && <ErrorBanner>{errors.address}</ErrorBanner>}
              </FormField>
            </Col>

            <Col $span={4}>
              <FormField label="Celular" htmlFor="phone">
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="Ej: 3446..."
                />
                {errors.phone && <ErrorBanner>{errors.phone}</ErrorBanner>}
              </FormField>
            </Col>

            <Col $span={4}>
              <FormField label="E-mail" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nombre@mail.com"
                />
                {errors.email && <ErrorBanner>{errors.email}</ErrorBanner>}
              </FormField>
            </Col>

            <Col $span={4}>
              <FormField label="Cuenta" htmlFor="account">
                <Input
                  id="account"
                  name="account"
                  value={form.account}
                  onChange={handleChange}
                  placeholder="Ej: Propia"
                />
                {errors.account && <ErrorBanner>{errors.account}</ErrorBanner>}
              </FormField>
            </Col>

            <Col $span={4}>
              <FormField label="Ruta" htmlFor="route">
                <Input
                  id="route"
                  name="route"
                  value={form.route}
                  onChange={handleChange}
                  placeholder="Ej: Centro"
                />
                {errors.route && <ErrorBanner>{errors.route}</ErrorBanner>}
              </FormField>
            </Col>

            <Col $span={4}>
              <FormField label="Programa" htmlFor="program">
                <Select
                  id="program"
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  placeholder="Seleccionar programa"
                >
                  {Object.values(ProgramasSociales).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
                {errors.program && <ErrorBanner>{errors.program}</ErrorBanner>}
              </FormField>
            </Col>
          </FormGrid>

          <Divider />

          <Actions>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : submitLabel}
            </Button>
          </Actions>
        </form>
    </Card>
  );
};

export default RecuperadorForm;
