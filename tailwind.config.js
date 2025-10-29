/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Apple Color Emoji', 'Segoe UI Emoji'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#2563eb',
        },
        accent: {
          50: '#f5f3ff',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.05), 0 1px 1px rgba(0,0,0,0.03)'
      },
      borderRadius: {
        xl: '0.75rem',
      },
      transitionTimingFunction: {
        'emphasized': 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
}
