import type {
  DashboardMaterial as DashboardMaterialBase,
  DashboardData as DashboardDataBase,
} from "@recicla/shared";

export type DashboardMaterial = DashboardMaterialBase;

export interface DashboardKpi {
  label: string;
  value: string;
  hint: string;
  progress: number;
  icon: string;
  highlight?: boolean;
  trend?: {
    direction: "up" | "down" | "flat";
    percentage: number;
  };
  sparkline?: number[];
}

export type DashboardData = DashboardDataBase;

export type DashboardStatus = "loading" | "error" | "empty" | "success";
