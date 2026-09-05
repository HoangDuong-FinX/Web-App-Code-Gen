import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

// Module Federation remote. The Host loads probe_hotel_note/App from
// dist/remoteEntry.js - the remote name and the exposed key are the contract with
// the Host, so change them only together with the Host configuration.
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "probe_hotel_note",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
  build: {
    target: "esnext",
    modulePreload: false,
    cssCodeSplit: false,
  },
});
