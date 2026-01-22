/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores institucionales UNAHUR
        'unahur': {
          'green': '#5aa531',
          'blue': '#329eba',
          'accent': '#78cee4',
          'light-green': '#b1e198',
        },
        'light-bg': '#f8f9fa',
        'dark-gray': '#333333',
        'medium-gray': '#666666',
        'light-gray': '#f0f0f0',
        'white': '#ffffff',
        'error-red': '#dc3545',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'button': '0 4px 14px 0 rgba(50, 158, 186, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'spin-slow': 'spin 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}