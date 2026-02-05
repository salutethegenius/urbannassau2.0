import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Urban Nassau Rides Golden Theme
        golden: {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#FFB800', // Primary golden yellow from logo
          600: '#CC9300',
          700: '#996E00',
          800: '#664A00',
          900: '#332500',
        },
        brand: {
          gold: '#FFB800',      // Primary golden yellow
          black: '#1A1A1A',     // Rich black for text
          dark: '#333333',      // Secondary dark
          white: '#FFFFFF',
          gray: '#F5F5F5',      // Light gray for backgrounds
        },
        turquoise: {
          50: '#E6FAFA',
          100: '#CCF5F5',
          200: '#99EBEB',
          300: '#66E0E0',
          400: '#33D6D6',
          500: '#00CCCC',      // Admin accent
          600: '#00A3A3',
          700: '#007A7A',
          800: '#005252',
          900: '#002929',
        },
        'bahamian-gold': '#CC9300',  // Admin secondary (darker golden)
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'uber': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
