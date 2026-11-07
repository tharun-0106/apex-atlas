/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101319',
        panel: '#161D29',
        card: '#1C222D',
        line: '#2A3242',
        apex: '#E10600',
        fg: '#F2F3F5',
        muted: '#AAB1BE',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 32px -6px rgba(225, 6, 0, 0.45)',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
      },
    },
  },
  plugins: [],
}
