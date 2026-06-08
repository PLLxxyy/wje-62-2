/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        crt: {
          bg: "#0a0a0a",
          bgDark: "#050505",
          green: "#39ff14",
          greenDark: "#1a4d1a",
          greenDarker: "#0d260d",
          amber: "#ffaa00",
          amberDark: "#664400",
          border: "#1a4d1a",
          borderLight: "#2d6a2d",
        },
      },
      fontFamily: {
        mono: ['"Courier New"', '"Lucida Console"', 'Monaco', 'monospace'],
        retro: ['"VT323"', '"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'crt-glow': '0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3)',
        'crt-glow-sm': '0 0 5px rgba(57, 255, 20, 0.4)',
        'button-raised': '2px 2px 0px #1a4d1a, 4px 4px 0px #0d260d',
        'button-pressed': '1px 1px 0px #1a4d1a',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 6s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'breathing': 'breathing 2s ease-in-out infinite',
        'print-line': 'printLine 0.05s ease-out forwards',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.97' },
          '50%': { opacity: '1' },
        },
        breathing: {
          '0%, 100%': { opacity: '0.4', boxShadow: '0 0 5px rgba(57, 255, 20, 0.3)' },
          '50%': { opacity: '1', boxShadow: '0 0 15px rgba(57, 255, 20, 0.8)' },
        },
        printLine: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
