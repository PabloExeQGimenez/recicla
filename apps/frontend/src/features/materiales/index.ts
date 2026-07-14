export { default as materialesService } from "./services/materialService";

export type {
  Material,
  CreateMaterial as CreateMaterialPayload,
  ChangeMaterialPrice as ChangeCurrentPricePayload,
} from "@recicla/shared";

export { createMaterialSchema as materialFormSchema } from "@recicla/shared";
export type { CreateMaterialSchema as MaterialFormValues } from "@recicla/shared";
