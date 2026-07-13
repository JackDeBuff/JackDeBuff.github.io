import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  // react-draggable (via react-rnd) references `process.env.DRAGGABLE_DEBUG`
  // in its internal log(); `process` is undefined in the browser, so this
  // throws the moment a window's `position` prop changes (i.e. on maximize).
  // Production already strips it; this keeps the dev server from crashing too.
  define: {
    "process.env.DRAGGABLE_DEBUG": "false",
  },
});
