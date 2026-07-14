import { useMemo, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { useDashboardHistory } from "../hooks/useDashboardHistory";
import { useAllMaterials } from "../hooks/useAllMaterials";
import type { DashboardKpi, DashboardMaterial } from "../types/Dashboard.types";
import { KpiPanel, MaterialsPanel, PeriodSelector } from "../components";
import { Page, Grid } from "./DashboardPage.styles";

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const calculateTrend = (
  current: number,
  previous: number,
): { direction: "up" | "down" | "flat"; percentage: number } => {
  if (previous === 0 && current === 0)
    return { direction: "flat", percentage: 0 };
  if (previous === 0) return { direction: "up", percentage: 100 };

  const change = ((current - previous) / previous) * 100;

  if (Math.abs(change) < 1) return { direction: "flat", percentage: 0 };
  if (change > 0) return { direction: "up", percentage: change };
  return { direction: "down", percentage: Math.abs(change) };
};

export const DashboardPage = () => {
  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data, loading, error } = useDashboard(year, month);
  const { materials: allMaterials } = useAllMaterials();

  const { history } = useDashboardHistory(year, month);

  const historyWithCurrent = useMemo(() => {
    if (!data) return [];
    return [...history, { year, month, data }];
  }, [history, data, year, month]);

  const materials: DashboardMaterial[] = useMemo(() => {
    const totalKg = data?.totalKgThisMonth ?? 0;

    return allMaterials
      .filter((m) => m.active)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((mat) => {
        const dashboardMat = data?.materials.find((m) => m.name === mat.name);
        const matKg = dashboardMat?.totalKg ?? 0;
        return {
          name: mat.name,
          totalKg: matKg,
          share: totalKg > 0 ? clamp01(matKg / totalKg) : 0,
        };
      });
  }, [allMaterials, data]);

  const kpis: DashboardKpi[] = useMemo(() => {
    const pendingAmount = data?.pendingAmount ?? 0;
    const completedPaymentsAmount = data?.completedPaymentsAmount ?? 0;
    const recoverers = data?.recoverersThisMonth ?? 0;
    const totalKg = data?.totalKgThisMonth ?? 0;

    const prevData =
      history.length > 0 ? history[history.length - 1]?.data : null;

    const prevPendingAmount = prevData?.pendingAmount ?? 0;
    const prevCompletedPaymentsAmount = prevData?.completedPaymentsAmount ?? 0;
    const prevRecoverers = prevData?.recoverersThisMonth ?? 0;
    const prevTotalKg = prevData?.totalKgThisMonth ?? 0;

    const sparkKg = historyWithCurrent.map(
      (h) => h.data?.totalKgThisMonth ?? 0,
    );
    const sparkPending = historyWithCurrent.map(
      (h) => h.data?.pendingAmount ?? 0,
    );
    const sparkPayments = historyWithCurrent.map(
      (h) => h.data?.completedPaymentsAmount ?? 0,
    );
    const sparkRecoverers = historyWithCurrent.map(
      (h) => h.data?.recoverersThisMonth ?? 0,
    );

    return [
      {
        label: "Kg del mes",
        value: loading ? "—" : `${totalKg.toFixed(2)} kg`,
        hint: "Total de materiales",
        progress: totalKg === 0 ? 0.1 : clamp01(Math.log10(totalKg + 1) / 5),
        icon: "kilograms",
        highlight: true,
        trend: calculateTrend(totalKg, prevTotalKg),
        sparkline: sparkKg,
      },
      {
        label: "Pagos pendientes",
        value: loading ? "—" : formatARS(pendingAmount),
        hint: "",
        progress:
          pendingAmount === 0
            ? 0.12
            : clamp01(Math.log10(pendingAmount + 1) / 6),
        icon: "pending",
        highlight: false,
        trend: calculateTrend(pendingAmount, prevPendingAmount),
        sparkline: sparkPending,
      },
      {
        label: "Pagos realizados",
        value: loading ? "—" : formatARS(completedPaymentsAmount),
        hint: "Del mes",
        progress:
          completedPaymentsAmount === 0
            ? 0.1
            : clamp01(Math.log10(completedPaymentsAmount + 1) / 6),
        icon: "payments",
        highlight: false,
        trend: calculateTrend(
          completedPaymentsAmount,
          prevCompletedPaymentsAmount,
        ),
        sparkline: sparkPayments,
      },
      {
        label: "Recuperadores",
        value: loading ? "—" : String(recoverers),
        hint: "Que ingresaron material este mes",
        progress:
          recoverers === 0 ? 0.1 : clamp01(Math.log10(recoverers + 1) / 3),
        icon: "recoverers",
        highlight: false,
        trend: calculateTrend(recoverers, prevRecoverers),
        sparkline: sparkRecoverers,
      },
    ];
  }, [data, loading, history, historyWithCurrent]);

  const handlePeriodChange = (newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
  };

  return (
    <Page>
      {error && <div>{error}</div>}

      <Grid>
        <KpiPanel
          kpis={kpis}
          loading={loading}
          headerRight={
            <PeriodSelector
              year={year}
              month={month}
              loading={loading}
              onPeriodChange={handlePeriodChange}
            />
          }
        />

        <MaterialsPanel
          materials={materials}
          totalKg={data?.totalKgThisMonth ?? 0}
          loading={loading}
        />
      </Grid>
    </Page>
  );
};
