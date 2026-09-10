import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Standalone entry. When the Host mounts this app as a remote it imports
// ./App directly and this file is not used.
const container = document.getElementById("root");
if (!container) {
  throw new Error("#root is missing from index.html");
}
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
