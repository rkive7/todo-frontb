import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import  {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  VitePWA({
  registerType:"autoUpdate",
  manifest:{
    name:"Todo App",
    short_name: "Todo",
    description: "Una aplicacion de tareas simple",
    start_url: "./",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f0346f",
    icons:[
        {
            src: "/icons/icon192x192.png",
            sizes: "192x192",
            type: "image/png"
        },
        {
            src: "/icons/icon512x512.png",
            sizes: "512x512",
            type: "image/png"
        }
    ],
    screenshots: [
      {
        src:'/screenshots/captura1.png',
        sizes: '1919x868',
        type: 'image/png',
      }
    ],
  },
    devOptions:{
      enabled: true
      },
    }),
  ],
});
