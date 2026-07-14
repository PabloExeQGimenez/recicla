import type { CreateRecuperadorPayload } from "../types/Recuperador.types";

const cleanOptional = (s: string | undefined): string | undefined => {
  const v = s?.trim();
  return v ? v : undefined;
};

type FormValues = {
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
};

const toCreateRecuperadorPayload = (
  form: FormValues
): CreateRecuperadorPayload => {
  const payload: CreateRecuperadorPayload = {
    name: form.name.trim(),
    lastName: form.lastName.trim(),
    dni: cleanOptional(form.dni),
    cuil: cleanOptional(form.cuil),
    birthdate: cleanOptional(form.birthdate),
    address: cleanOptional(form.address),
    phone: cleanOptional(form.phone),
    email: cleanOptional(form.email),
    account: cleanOptional(form.account),
    route: cleanOptional(form.route),
    program: cleanOptional(form.program),
  };
  return payload;
};

export default toCreateRecuperadorPayload;
