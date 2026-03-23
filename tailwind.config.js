/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans',             'system-ui', 'sans-serif'],
        display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#4F46E5', hover: '#4338CA', light: '#EEF2FF', dark: '#3730A3' },
        sidebar: { DEFAULT: '#080F1F', border: 'rgba(255,255,255,0.07)' },
        surface: '#F4F6FE',
        card:    '#FFFFFF',
        success: '#10B981',
        warning: '#F59E0B',
        danger:  '#EF4444',
        fraud:   '#F97316',
      },
      boxShadow: {
        card:        '0 1px 2px rgba(79,70,229,0.04), 0 4px 20px rgba(79,70,229,0.07)',
        'card-hover':'0 8px 32px rgba(79,70,229,0.14)',
        modal:       '0 30px 60px rgba(0,0,0,0.4)',
        glow:        '0 0 40px rgba(79,70,229,0.25)',
        'glow-sm':   '0 0 20px rgba(79,70,229,0.18)',
      },
      animation: {
        'fade-up':    'fadeUp 0.45s ease forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
        'slide-right':'slideRight 0.4s ease forwards',
        'float':      'float 7s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:     { '0%': { opacity:0, transform:'translateY(22px)' }, '100%': { opacity:1, transform:'translateY(0)' } },
        fadeIn:     { '0%': { opacity:0 }, '100%': { opacity:1 } },
        slideRight: { '0%': { opacity:0, transform:'translateX(-12px)' }, '100%': { opacity:1, transform:'translateX(0)' } },
        float:      { '0%,100%': { transform:'translateY(0px)' }, '50%': { transform:'translateY(-16px)' } },
      },
    },
  },
  plugins: [],
}
