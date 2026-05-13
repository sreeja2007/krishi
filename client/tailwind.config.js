/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f3',
          100: '#dcede3',
          200: '#bbdbc9',
          300: '#8ec2a7',
          400: '#5da37f',
          500: '#3a8660',
          600: '#2a6b4c',
          700: '#1a5c38',
          800: '#174d30',
          900: '#143f28',
        },
        amber: {
          400: '#f5c842',
          500: '#e9a825',
          600: '#d4911a',
        },
        soil: '#8B5E3C',
      },
      fontFamily: {
        sans:    ['"DM Sans"',   'sans-serif'],
        heading: ['"Fraunces"',  'serif'],
      },
      fontSize: {
        xs:    ['0.78rem',  { lineHeight: '1.4' }],
        sm:    ['0.9rem',   { lineHeight: '1.5' }],
        base:  ['1rem',     { lineHeight: '1.7' }],
        lg:    ['1.15rem',  { lineHeight: '1.6' }],
        xl:    ['1.3rem',   { lineHeight: '1.5' }],
        '2xl': ['1.6rem',   { lineHeight: '1.4' }],
        '3xl': ['2rem',     { lineHeight: '1.3' }],
        '4xl': ['2.4rem',   { lineHeight: '1.2' }],
        '5xl': ['3rem',     { lineHeight: '1.1' }],
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'pulse-dot': 'pulseDot 1.4s infinite ease-in-out',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 },                          to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseDot: { '0%,80%,100%': { transform: 'scale(0)' },     '40%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
