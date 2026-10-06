import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes";
import { LocaleProvider } from "./i18n/locale";
import { ThemeProvider } from "./hooks/use-theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>,
);
