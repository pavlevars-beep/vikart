/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#173D35',
        cream: '#F7F3EB',
        'warm-white': '#FFFDFA',
        gold: '#C6A15B',
        terracotta: '#B96F51',
        ink: '#17211D',
        'ink-soft': '#66716B',
        sage: '#E7EEE9',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 33, 29, 0.06), 0 4px 16px rgba(23, 33, 29, 0.08)',
        'card-hover': '0 2px 4px rgba(23, 33, 29, 0.08), 0 8px 24px rgba(23, 33, 29, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
