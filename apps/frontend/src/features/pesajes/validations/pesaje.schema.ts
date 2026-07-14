import { z } from "zod";

export const pesajeLineSchema = z.object({
  tempId: z.string(),
  materialId: z.string().trim().min(1, "El material es obligatorio"),
  materialLabel: z.string(),
  precio: z.number(),
  cantidad: z.number().positive("La cantidad debe ser mayor a 0"),
  subtotal: z.number(),
});

export const pesajeFormSchema = z.object({
  recuperadorId: z.string().trim().min(1, "El recuperador es obligatorio"),
  fecha: z.string().refine(
    (val) => {
      const today = new Date().toLocaleDateString("en-CA");
      return val <= today;
    },
    { message: "La fecha no puede ser futura" }
  ),
  items: z
    .array(pesajeLineSchema)
    .min(1, "Agrega pesajes antes de guardar"),
});

export type PesajeLineValues = z.infer<typeof pesajeLineSchema>;
export type PesajeFormValues = z.infer<typeof pesajeFormSchema>;
