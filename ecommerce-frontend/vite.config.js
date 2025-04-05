import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".", // Ensure the root is set to the project directory
  server: {
    port: 3000, // Thay đổi port tại đây
  },
});
