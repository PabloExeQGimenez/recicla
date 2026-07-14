import { DashboardData } from './dashboard-data';

export const DASHBOARD_REPOSITORY = Symbol('DASHBOARD_REPOSITORY');

export interface DashboardRepository {
  getCurrentMonthData(from: Date, to: Date): Promise<DashboardData>;
}
