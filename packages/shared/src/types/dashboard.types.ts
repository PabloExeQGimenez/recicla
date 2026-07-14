export interface DashboardMaterial {
  name: string;
  totalKg: number;
  share?: number;
}

export interface DashboardData {
  recoverersThisMonth: number;
  totalKgThisMonth: number;
  pendingAmount: number;
  pendingPaymentRequests: number;
  completedPaymentsAmount: number;
  materials: DashboardMaterial[];
}
