import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/web/",
  plugins: [
    tailwindcss(),

    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),

    VitePWA({
      registerType: "autoUpdate", // アプリの更新を自動で検知
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "確率狼",
        short_name: "確率狼",
        description: "役職人数がランダムな新感覚人狼ゲーム",
        theme_color: "#1a1a1a", // ツールバーの色
        background_color: "#1a1a1a", // スプラッシュ画面の背景色
        display: "standalone", // ブラウザのUI（URLバー等）を非表示にする
        orientation: "portrait", // 縦画面に固定
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Androidのアイコン形状に合わせる設定
          },
        ],
      },
    }),
  ],
});
