/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Cor principal — azul profundo #003087
        brand: {
          DEFAULT: '#003087',
          light: '#3355AA',
          dark: '#002060',
          50: '#EEF2FA',
          100: '#DCE4F4',
        },
        // Superfícies — blocos brancos sobre cinza claro
        canvas: '#F5F5F7',
        ink: {
          DEFAULT: '#18181B',
          muted: '#7E7E8A',
        },
        line: '#E2E2E8',
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        surface:
          '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 2px 8px -2px rgb(15 23 42 / 0.06), 0 8px 24px -4px rgb(15 23 42 / 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        trinas: {
          primary: '#003087',
          'primary-focus': '#002060',
          'primary-content': '#ffffff',
          secondary: '#EBEBEF',
          'secondary-content': '#18181B',
          accent: '#A3A7FC',
          'accent-content': '#232A66',
          neutral: '#18181B',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#F5F5F7',
          'base-300': '#E2E2E8',
          'base-content': '#18181B',
          info: '#3355AA',
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626',
          '--rounded-box': '1rem',
          '--rounded-btn': '9999px',
          '--rounded-badge': '9999px',
          '--btn-text-case': 'none',
          '--animation-btn': '0.2s',
          '--btn-focus-scale': '0.97',
          '--border-btn': '1px',
        },
      },
    ],
  },
}
