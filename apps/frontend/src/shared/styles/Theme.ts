export const theme = {
  colors: {
    // Identidad / marca
    brand: {
      primary: "#16A34A", // verde moderno
      secondary: "#17315F", // azul marca
      accent: "#2563EB", // azul acento (links/acciones secundarias)
    },

    // Colores comunes
    common: {
      white: "#FFFFFF",
      black: "#0B1220",
    },

    // Superficies (fondos)
    surface: {
      app: "#F1F5F9", // fondo general (slate-100)
      card: "#FFFFFF", // tarjetas / tablas / paneles
      sidebar: "#0F2450", // azul profundo (armoniza con brand.secondary)
      topbar: "#FFFFFF",
    },

    // Tipografía
    text: {
      primary: "#0F172A", // más “premium” que #111827
      secondary: "#475569", // slate-600
      muted: "#94A3B8", // slate-400 (placeholders / hints)
      inverse: "#FFFFFF",
    },

    // Bordes y divisores
    border: {
      subtle: "rgba(15, 23, 42, 0.08)",
      default: "rgba(15, 23, 42, 0.12)",
      strong: "rgba(15, 23, 42, 0.18)",
    },

    // Estados
    state: {
      success: "#16A34A",
      danger: "#DC2626",
      warning: "#F59E0B",
      info: "#2563EB",
    },
  },

  // Tipografía
  fontSizes: {
    xs: "0.75rem", // 12
    sm: "0.875rem", // 14
    md: "1rem", // 16
    lg: "1.125rem", // 18
    xl: "1.25rem", // 20
    "2xl": "1.5rem", // 24
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Radios
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    pill: "999px",
  },

  // Sombras (más suaves y modernas)
  shadows: {
    sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
    md: "0 6px 18px rgba(15, 23, 42, 0.10)",
    lg: "0 14px 34px rgba(15, 23, 42, 0.14)",
  },

  spacing: (factor: number) => `${factor * 8}px`,

  motion: {
    fast: "120ms ease",
    normal: "180ms ease",
  },
} as const;
