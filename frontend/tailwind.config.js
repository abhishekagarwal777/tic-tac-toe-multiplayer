/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [],
};





// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         // Custom color palette for the game
//         primary: {
//           50: '#f0f9ff',
//           100: '#e0f2fe',
//           200: '#bae6fd',
//           300: '#7dd3fc',
//           400: '#38bdf8',
//           500: '#0ea5e9',
//           600: '#0284c7',
//           700: '#0369a1',
//           800: '#075985',
//           900: '#0c4a6e',
//         },
//         secondary: {
//           50: '#faf5ff',
//           100: '#f3e8ff',
//           200: '#e9d5ff',
//           300: '#d8b4fe',
//           400: '#c084fc',
//           500: '#a855f7',
//           600: '#9333ea',
//           700: '#7e22ce',
//           800: '#6b21a8',
//           900: '#581c87',
//         },
//         accent: {
//           50: '#fdf2f8',
//           100: '#fce7f3',
//           200: '#fbcfe8',
//           300: '#f9a8d4',
//           400: '#f472b6',
//           500: '#ec4899',
//           600: '#db2777',
//           700: '#be185d',
//           800: '#9d174d',
//           900: '#831843',
//         },
//       },
//       fontFamily: {
//         sans: [
//           '-apple-system',
//           'BlinkMacSystemFont',
//           '"Segoe UI"',
//           'Roboto',
//           '"Helvetica Neue"',
//           'Arial',
//           'sans-serif',
//         ],
//         mono: [
//           'ui-monospace',
//           'SFMono-Regular',
//           'Menlo',
//           'Monaco',
//           'Consolas',
//           '"Liberation Mono"',
//           '"Courier New"',
//           'monospace',
//         ],
//       },
//       fontSize: {
//         'xs': '0.75rem',
//         'sm': '0.875rem',
//         'base': '1rem',
//         'lg': '1.125rem',
//         'xl': '1.25rem',
//         '2xl': '1.5rem',
//         '3xl': '1.875rem',
//         '4xl': '2.25rem',
//         '5xl': '3rem',
//         '6xl': '3.75rem',
//         '7xl': '4.5rem',
//       },
//       spacing: {
//         '72': '18rem',
//         '84': '21rem',
//         '96': '24rem',
//         '128': '32rem',
//       },
//       borderRadius: {
//         'none': '0',
//         'sm': '0.125rem',
//         DEFAULT: '0.25rem',
//         'md': '0.375rem',
//         'lg': '0.5rem',
//         'xl': '0.75rem',
//         '2xl': '1rem',
//         '3xl': '1.5rem',
//         'full': '9999px',
//       },
//       boxShadow: {
//         'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//         DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
//         'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//         'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//         'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//         '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
//         'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
//         'none': 'none',
//       },
//       animation: {
//         'spin-slow': 'spin 3s linear infinite',
//         'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'bounce-slow': 'bounce 2s infinite',
//         'fade-in': 'fadeIn 0.5s ease-in',
//         'slide-up': 'slideUp 0.3s ease-out',
//         'slide-down': 'slideDown 0.3s ease-out',
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(20px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//         slideDown: {
//           '0%': { transform: 'translateY(-20px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//       },
//       transitionDuration: {
//         '0': '0ms',
//         '75': '75ms',
//         '100': '100ms',
//         '150': '150ms',
//         '200': '200ms',
//         '300': '300ms',
//         '500': '500ms',
//         '700': '700ms',
//         '1000': '1000ms',
//       },
//       backdropBlur: {
//         xs: '2px',
//         sm: '4px',
//         DEFAULT: '8px',
//         md: '12px',
//         lg: '16px',
//         xl: '24px',
//         '2xl': '40px',
//         '3xl': '64px',
//       },
//       zIndex: {
//         '0': '0',
//         '10': '10',
//         '20': '20',
//         '30': '30',
//         '40': '40',
//         '50': '50',
//         'auto': 'auto',
//       },
//     },
//   },
//   plugins: [
//     // Add Tailwind plugins here if needed
//     // require('@tailwindcss/forms'),
//     // require('@tailwindcss/typography'),
//     // require('@tailwindcss/aspect-ratio'),
//   ],
// }