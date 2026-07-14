import type { ReactNode } from "react";
import {
  FaMoneyBillWave,
  FaChartColumn,
  FaUserGroup,
  FaCube,
  FaClockRotateLeft,
} from "react-icons/fa6";
import type { DashboardKpi } from "../../types/Dashboard.types";
import { KpiCard } from "./KpiCard";
import {
  Panel,
  PanelHead,
  PanelTitle,
  KpiGrid,
} from "./KpiPanel.styles";

const ICON_MAP: Record<string, React.ReactNode> = {
  payments: <FaMoneyBillWave />,
  pending: <FaClockRotateLeft />,
  weighings: <FaCube />,
  recoverers: <FaUserGroup />,
  kilograms: <FaChartColumn />,
};

interface KpiPanelProps {
  kpis: DashboardKpi[];
  loading?: boolean;
  headerRight?: ReactNode;
}

export const KpiPanel = ({ kpis, headerRight }: KpiPanelProps) => {
  return (
    <Panel>
      <PanelHead>
        <PanelTitle>Resumen mensual</PanelTitle>
        {headerRight}
      </PanelHead>

      <KpiGrid>
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
            progress={kpi.progress}
            icon={ICON_MAP[kpi.icon] ?? <FaCube />}
            highlight={kpi.highlight}
            trend={kpi.trend}
            sparkline={kpi.sparkline}
          />
        ))}
      </KpiGrid>
    </Panel>
  );
};
