import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import Register from "@/pages/register/Register";

function renderApp() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Register />
      <Toaster richColors />
    </StrictMode>,
  );
}

if (import.meta.env.DEV) {
  import("../../mocks/mockGoogleScript").then(({ setupMockGoogleScript }) => {
    setupMockGoogleScript();
    renderApp();
  });
} else {
  renderApp();
}
