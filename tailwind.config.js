/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Grayscale
        gray: {
          100: 'hsl(0, 0%, 100%)',
          95: 'hsl(0, 0%, 95%)',
          90: 'hsl(0, 0%, 90%)',
          85: 'hsl(0, 0%, 85%)',
          60: 'hsl(0, 0%, 60%)',
          35: 'hsl(0, 0%, 35%)',
          10: 'hsl(0, 0%, 10%)',
          5: 'hsl(0, 0%, 5%)',
          0: 'hsl(0, 0%, 0%)',
        },
        // Brand Accent (Blue)
        brand: {
          10: 'hsl(222, 76%, 10%)',
          30: 'hsl(222, 76%, 30%)',
          70: 'hsl(222, 76%, 70%)',
          90: 'hsl(222, 76%, 90%)',
        },
      },
      fontSize: {
        'h1': ['1.125rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1rem', { lineHeight: '1.2', fontWeight: '700' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      boxShadow: {
        'sm': '0 2px 6px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 6px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
