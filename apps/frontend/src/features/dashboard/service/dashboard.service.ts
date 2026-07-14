import { apiFetch } from "../../../shared/lib/api";

export type DashboardMaterialDTO = {
  name: string;
  totalKg: number;
};

export type DashboardDTO = {
  recoverersThisMonth: number;
  totalKgThisMonth: number;
  pendingAmount: number;
  pendingPaymentRequests: number;
  completedPaymentsAmount: number;
  materials: DashboardMaterialDTO[];
};

export const dashboardService = {
  async get(year?: number, month?: number): Promise<DashboardDTO> {
    const params = new URLSearchParams();
    if (year !== undefined) params.set("year", String(year));
    if (month !== undefined) params.set("month", String(month));
    const query = params.toString();
    return apiFetch<DashboardDTO>(`/dashboard${query ? `?${query}` : ""}`);
  },
};
