/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#b5a1e5',
          dark: '#100e17'
        },
        background: {
          DEFAULT: '#000000',
          surface: '#0a0a0a'
        },
        text: {
          primary: '#f2f2f5',
          secondary: '#e6e6eb',
          variant: '#a7a4ae',
          variant2: '#d2cfda'
        },
        // Add a 'border' color so the utility class `border-border` works
        border: '#3e3d40',
        outline: '#3e3d40',
        aqi: {
          1: { bg: '#55e755', text: '#1f331f' },
          2: { bg: '#f6f657', text: '#33311f' },
          3: { bg: '#bf9e60', text: '#332b1f' },
          4: { bg: '#e37ac2', text: '#331f1f' },
          5: { bg: '#e66e5e', text: '#2f1b25' }
        }
      },
      // Extend opacity scale for non-standard utility `bg-opacity-8`
      opacity: {
        8: '0.08'
      },
      fontFamily: {
        'nunito': ['Nunito Sans', 'sans-serif']
      },
      borderRadius: {
        '28': '28px',
        '16': '16px'
      },
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    }
  },
  plugins: []
}