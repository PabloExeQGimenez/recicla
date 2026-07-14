import { z } from "zod";

export const solicitudPagoFormSchema = z
  .object({
    from: z.string().min(1, "La fecha desde es obligatoria"),
    to: z.string().min(1, "La fecha hasta es obligatoria"),
  })
  .refine((data) => data.from <= data.to, {
    message: "La fecha desde debe ser anterior a la fecha hasta",
    path: ["to"],
  });

export type SolicitudPagoFormValues = z.infer<typeof solicitudPagoFormSchema>;
