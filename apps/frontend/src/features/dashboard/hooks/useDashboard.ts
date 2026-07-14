import { useEffect, useState } from "react";
import { dashboardService, type DashboardDTO } from "../service/dashboard.service";

export const useDashboard = (year?: number, month?: number) => {
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dashboardService.get(year, month);
        if (alive) setData(result);
      } catch (e) {
        if (alive)
          setError(
            e instanceof Error ? e.message : "Error al cargar dashboard",
          );
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [year, month]);

  return { data, loading, error };
};
