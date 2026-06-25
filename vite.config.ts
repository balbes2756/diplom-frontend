import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: "0.0.0.0", // ← ИЗМЕНЕНО: слушать на всех интерфейсах
        port: Number(process.env.PORT) || 5173, // ← ИЗМЕНЕНО: динамический порт
    },
    preview: {
        host: "0.0.0.0", // ← ДОБАВЛЕНО: для production
        port: Number(process.env.PORT) || 4173, // ← ДОБАВЛЕНО: для production
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
