import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./provider/themeProvider";
import { ToastProvider } from "../shared/UI/Toast/ToastProvider";
import { AuthProvider } from "../shared/auth/AuthContext.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("No se encontró el elemento root");

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
