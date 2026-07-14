export * from "./components";
export * from "./services";
export { default as useRecuperadores } from "./hooks/useRecuperadores";
export { default as useRecuperador } from "./hooks/useRecuperador";
export { default as useRecuperadoresOptions } from "./hooks/useRecuperadoresOptions";
export { useToggleActiveRecuperador } from "./hooks/useToggleActiveRecuperador";

export type {
  Recuperador,
  RecuperadorFilters as RecuperadoresQuery,
  CreateRecuperador as CreateRecuperadorPayload,
  UpdateRecuperador as UpdateRecuperadorPayload,
} from "@recicla/shared";

export type { PaginatedResponse as RecuperadoresPage } from "@recicla/shared";

export { createRecuperadorSchema as recuperadorFormSchema } from "@recicla/shared";
export type { CreateRecuperadorSchema as RecuperadorFormValues } from "@recicla/shared";
