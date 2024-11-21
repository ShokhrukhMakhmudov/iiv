/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        mont: ["var(--mont-regular)", "sans-serif"],
        montMed: ["var(--mont-medium)", "sans-serif"],
        montSemi: ["var(--mont-semi)", "sans-serif"],
        montBold: ["var(--mont-bold)", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          primary: "#4f46e5",
          secondary: "#0d9488",
          accent: "#f59e0b",
          neutral: "#111827",
          "base-100": "#dcdcdc",
          info: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
          "--rounded-btn": "0.5rem",
          color: "#000000",
          headerbg: "#fff",
        },
      },
      // {
      //   light: {
      //     primary: "#4f46e5", // Цвета для light темы
      //     secondary: "#0d9488",
      //     accent: "#f59e0b",
      //     neutral: "#111827",
      //     "base-100": "#ffffff", // Базовый цвет фона
      //     info: "#3b82f6",
      //     success: "#10b981",
      //     warning: "#f59e0b",
      //     error: "#ef4444",
      //     // Добавляем черный цвет текста для светлой темы
      //     "--rounded-btn": "1rem",
      //     color: "#000000", // Текст для светлой темы
      //     headerbg: "#fff",
      //   },
      //   dark: {
      //     primary: "#4f46e5", // Цвета для dark темы
      //     secondary: "#0d9488",
      //     accent: "#f59e0b",
      //     neutral: "#111827",
      //     "base-100": "#1f2937", // Базовый цвет фона
      //     info: "#3b82f6",
      //     success: "#10b981",
      //     warning: "#f59e0b",
      //     error: "#ef4444",
      //     // Добавляем белый цвет текста для темной темы
      //     "--rounded-btn": "1rem",
      //     color: "#ffffff", // Текст для темной темы
      //     headerbg: "#f3f4f6",
      //   },
      // },
    ],
  },
};
