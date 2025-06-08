import "@/index.css";
import Root from "@/pages/root/Root";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

function renderApp() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Root />
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
