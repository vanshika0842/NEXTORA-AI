/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#03050C",
          900: "#080B18",
          800: "#0D1226",
          700: "#141B36",
          600: "#1C2547",
        },
        ink: {
          900: "#0A0E1B",
          700: "#333A50",
          500: "#5B6480",
          300: "#9AA2BD",
        },
        indigo: {
          600: "#4F46E5",
          500: "#5B54F0",
        },
        electric: {
          500: "#2E6BFF",
          400: "#4C82FF",
        },
        cyan: {
          400: "#22D3EE",
        },
        violet: {
          400: "#A78BFA",
        },
        mint: {
          500: "#1FB874",
        },
        amber: {
          500: "#F5A524",
        },
        mist: {
          50: "#F6F8FD",
          100: "#EEF1FA",
          200: "#E4E8F5",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(93,102,138,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(93,102,138,0.08) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(600px circle at var(--x,50%) var(--y,20%), rgba(46,107,255,0.20), transparent 60%)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,14,27,0.04), 0 8px 24px -8px rgba(10,14,27,0.10)",
        card: "0 2px 8px rgba(10,14,27,0.06), 0 16px 40px -16px rgba(30,45,90,0.18)",
        glow: "0 0 0 1px rgba(46,107,255,0.25), 0 0 40px rgba(46,107,255,0.20)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        drift: {
          "0%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(6px,-8px)" },
          "100%": { transform: "translate(0,0)" },
        },
        sweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        floatY: "floatY 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
        drift: "drift 9s ease-in-out infinite",
        sweep: "sweep 14s linear infinite",
      },
    },
  },
  plugins: [],
};
