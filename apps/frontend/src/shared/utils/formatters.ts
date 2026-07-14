export function formatDate(
  value?: string | Date | null,
  locale: string = "es-AR",
): string {
  if (!value) return "-";

  let d: Date;
  if (value instanceof Date) {
    d = value;
  } else {
    const datePart = value.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      const [y, m, day] = datePart.split("-").map(Number);
      d = new Date(y, m - 1, day);
    } else {
      d = new Date(value);
    }
  }

  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function safe(value?: string | null): string {
  const v = value?.trim();
  return v ? v : "-";
}

export function formatCurrency(
  value: number | null | undefined,
  locale: string = "es-AR",
  currency: string = "ARS",
): string {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(
  value: number | null | undefined,
  locale: string = "es-AR",
  maximumFractionDigits: number = 2,
): string {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value);
}

export function formatPago(pago: string): string {
  switch (pago) {
    case "pendiente":
      return "Pendiente";
    case "solicitado":
      return "Solicitado";
    case "pagado":
      return "Pagado";
    default:
      return pago;
  }
}

export function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
