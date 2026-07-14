import type { ReactNode } from "react";
import {
  Card,
  CardTop,
  CardMeta,
  CardLabel,
  CardHint,
  CardValue,
  CardIcon,
  CardFooter,
  TrendBadge,
  SparklineWrapper,
} from "./KpiCard.styles";

interface Trend {
  direction: "up" | "down" | "flat";
  percentage: number;
}

interface KpiCardProps {
  label: string;
  value: string;
  hint: string;
  progress: number;
  icon: ReactNode;
  highlight?: boolean;
  trend?: Trend;
  sparkline?: number[];
}

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 60;
  const height = 24;
  const padding = 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  return (
    <SparklineWrapper>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SparklineWrapper>
  );
};

const TrendArrow = ({ direction }: { direction: "up" | "down" | "flat" }) => {
  if (direction === "up") return <span>↑</span>;
  if (direction === "down") return <span>↓</span>;
  return <span>→</span>;
};

export const KpiCard = ({
  label,
  value,
  hint,
  icon,
  highlight,
  trend,
  sparkline,
}: KpiCardProps) => {
  const sparkColor = highlight
    ? "rgb(99, 102, 241)"
    : trend?.direction === "down"
      ? "#dc2626"
      : "#10b981";

  return (
    <Card $highlight={highlight}>
      <CardTop>
        <CardMeta>
          <CardLabel>{label}</CardLabel>
          {hint && <CardHint>{hint}</CardHint>}
        </CardMeta>
        <CardIcon $highlight={highlight}>{icon}</CardIcon>
      </CardTop>

      <CardValue $highlight={highlight}>{value}</CardValue>

      <CardFooter>
        {trend && (
          <TrendBadge $direction={trend.direction}>
            <TrendArrow direction={trend.direction} />
            {trend.percentage > 0 ? `${trend.percentage.toFixed(0)}%` : "0%"}
          </TrendBadge>
        )}
        {sparkline && sparkline.length > 0 && (
          <Sparkline data={sparkline} color={sparkColor} />
        )}
      </CardFooter>
    </Card>
  );
};
