import { useEffect, useState } from "react";
import { dashboardService, type DashboardDTO } from "../service/dashboard.service";

export interface MonthData {
  year: number;
  month: number;
  data: DashboardDTO | null;
}

const getPreviousMonths = (year: number, month: number, count: number) => {
  const months: { year: number; month: number }[] = [];
  let y = year;
  let m = month;

  for (let i = 0; i < count; i++) {
    m -= 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    months.push({ year: y, month: m });
  }

  return months;
};

export const useDashboardHistory = (year: number, month: number) => {
  const [history, setHistory] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const months = getPreviousMonths(year, month, 5);

        const results = await Promise.all(
          months.map(async (m) => {
            const data = await dashboardService.get(m.year, m.month);
            return { year: m.year, month: m.month, data };
          }),
        );

        if (alive) setHistory(results.reverse());
      } catch {
        if (alive) setHistory([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [year, month]);

  return { history, loading };
};
