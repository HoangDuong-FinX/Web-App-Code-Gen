import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { federation } from "@module-federation/vite";

// Module Federation remote. The Host loads vikki_flight_booking/App from
// dist/remoteEntry.js - the remote name and the exposed key are the contract with
// the Host, so change them only together with the Host configuration.
export default defineConfig({
  plugins: [
    react(),
    // Turns the utility classes the screens are written with into real CSS. Without
    // it every className is dead text and the app renders unstyled while the build
    // stays green.
    tailwindcss(),
    federation({
      name: "vikki_flight_booking",
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
