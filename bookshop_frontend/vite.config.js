import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    port: 3001, // Cổng mà bạn muốn ứng dụng chạy trên đó
    strictPort: true, // Ngăn Vite tìm kiếm cổng khác nếu cổng này đã được sử dụng
  },
});
