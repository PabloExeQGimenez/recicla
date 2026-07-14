import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import type { DashboardMaterial } from "../../types/Dashboard.types";
import {
  Panel,
  PanelHead,
  PanelTitle,
  PanelHint,
  InlineMsg,
  ChartWrapper,
} from "./MaterialsPanel.styles";

const formatKg = (n: number) =>
  new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(n);

const MATERIAL_COLORS: Record<string, string> = {
  "Cartón": "#6366f1",
  "HDPE": "#10b981",
  "Latón": "#f59e0b",
  "PET": "#3b82f6",
  "PP": "#8b5cf6",
  "PS": "#ec4899",
  "PVC": "#14b8a6",
  "Vidrio": "#64748b",
};

const FALLBACK_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#64748b",
];

const getColor = (name: string, index: number): string => {
  if (MATERIAL_COLORS[name]) return MATERIAL_COLORS[name];
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

interface MaterialsPanelProps {
  materials: DashboardMaterial[];
  totalKg: number;
  loading?: boolean;
}

interface BarLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
  viewBox?: { y?: number; height?: number };
}

const BarLabel = ({ x = 0, y = 0, width = 0, value = 0, viewBox }: BarLabelProps) => {
  const isZero = value === 0;
  const labelY = isZero ? (viewBox?.y ?? 0) - 8 : y;

  return (
    <text
      x={x + width / 2}
      y={labelY}
      fill="#333"
      textAnchor="middle"
      dy={-6}
      fontSize={12}
      fontWeight={600}
    >
      {formatKg(value)} kg
    </text>
  );
};

export const MaterialsPanel = ({
  materials,
  totalKg,
  loading,
}: MaterialsPanelProps) => {
  return (
    <Panel>
      <PanelHead>
        <PanelTitle>Materiales del mes</PanelTitle>
        <PanelHint>
          {loading ? "Cargando…" : `${formatKg(totalKg)} kg`}
        </PanelHint>
      </PanelHead>

      {loading && <InlineMsg>Buscando movimientos del mes…</InlineMsg>}

      {!loading && materials.length > 0 && (
        <ChartWrapper>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={materials}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fontWeight: 600 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Bar dataKey="totalKg" radius={[6, 6, 0, 0]} label={<BarLabel />}>
                {materials.map((mat, index) => (
                  <Cell
                    key={mat.name}
                    fill={getColor(mat.name, index)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}
    </Panel>
  );
};
