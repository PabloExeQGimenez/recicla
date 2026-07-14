import { useMemo } from "react";
import { PeriodRow, NavBtn, Select, PeriodLabel } from "./PeriodSelector.styles";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface PeriodSelectorProps {
  year: number;
  month: number;
  loading?: boolean;
  onPeriodChange: (year: number, month: number) => void;
}

export const PeriodSelector = ({
  year,
  month,
  loading,
  onPeriodChange,
}: PeriodSelectorProps) => {
  const yearOptions = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => 2015 + i);
  }, []);

  const periodLabel = useMemo(() => {
    const mName = MONTHS[month - 1] ?? "";
    return `${mName} ${year}`;
  }, [month, year]);

  const goPrevMonth = () => {
    const d = new Date(year, month - 1, 1);
    d.setMonth(d.getMonth() - 1);
    onPeriodChange(d.getFullYear(), d.getMonth() + 1);
  };

  const goNextMonth = () => {
    const d = new Date(year, month - 1, 1);
    d.setMonth(d.getMonth() + 1);
    onPeriodChange(d.getFullYear(), d.getMonth() + 1);
  };

  return (
    <PeriodRow>
      <NavBtn type="button" onClick={goPrevMonth} aria-label="Mes anterior">
        ‹
      </NavBtn>

      <Select
        value={month}
        onChange={(e) => onPeriodChange(year, Number(e.target.value))}
        aria-label="Mes"
      >
        {MONTHS.map((name, idx) => (
          <option key={name} value={idx + 1}>
            {name}
          </option>
        ))}
      </Select>

      <Select
        value={year}
        onChange={(e) => onPeriodChange(Number(e.target.value), month)}
        aria-label="Año"
      >
        {yearOptions.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>

      <NavBtn type="button" onClick={goNextMonth} aria-label="Mes siguiente">
        ›
      </NavBtn>

      <PeriodLabel>{loading ? "Cargando…" : periodLabel}</PeriodLabel>
    </PeriodRow>
  );
};
