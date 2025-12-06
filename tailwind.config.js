/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          dark: 'var(--bg-dark)',
          light: 'var(--bg-light)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        border: {
          DEFAULT: 'var(--border)',
          muted: 'var(--border-muted)',
        },
        primary: 'var(--primary)',
        shadow: 'var(--shadow)',
        'shadow-hover': 'var(--shadow-hover)',
      },
      boxShadow: {
        'tg': '0 2px 8px var(--shadow)',
        'tg-hover': '0 6px 16px var(--shadow-hover)',
        'tg-button': '0 4px 12px var(--shadow), 0 0 0 1px var(--border) inset, 0 2px 4px rgba(0, 0, 0, 0.1) inset',
        'tg-button-hover': '0 6px 16px var(--shadow-hover), 0 0 0 1px var(--border) inset, 0 2px 4px rgba(0, 0, 0, 0.15) inset',
      },
    },
  },
  plugins: [],
}
