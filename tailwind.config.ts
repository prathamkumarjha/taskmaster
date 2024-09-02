import type { Config } from "tailwindcss"

const svgToDataUri = require("mini-svg-data-uri");
 
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");


const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        darkOliveGreen: "#556B2F",
        forestGreen: "#228B22",
        darkSeaGreen: "#8FBC8F",
        mossGreen: "#8A9A5B",
        hunterGreen: "#355E3B",
        darkPink: "#E75480",
        deepPink: "#FF1493",
        raspberry: "#872657",
        darkHotPink: "#FF007F",
        maroon: "#800000",
        indigo: "#4B0082",
        eggplant: "#614051",
        plum: "#8E4585",
        royalPurple: "#7851A9",
        darkOrchid: "#9932CC",
        midnightBlue: "#191970",
        navyBlue: "#000080",
        darkSlateBlue: "#483D8B",
        prussianBlue: "#003153",
        royalBlue: "#002366",
        darkRed: "#8B0000",
        burgundy: "#800020",
        crimson: "#DC143C",
        firebrick: "#B22222",
        bloodRed: "#660000",
        darkGoldenrod: "#B8860B",
        mustard: "#8B8000",
        olive: "#808000",
        khaki: "#BDB76B",
        bronze: "#665D1E",
        darkCyan: "#008B8B",
        slateGray: "#708090",
        deepSeaBlue: "#002F6C",
        mahogany: "#C04000",
        saddleBrown: "#8B4513",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        backgroundColor: {
          'transparent': 'transparent',
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        
        moveHorizontal: {
          "0%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
          "50%": {
            transform: "translateX(50%) translateY(10%)",
          },
          "100%": {
            transform: "translateX(-50%) translateY(-10%)",
          },
        },
        moveInCircle: {
          "0%": {
            transform: "rotate(0deg)",
          },
          "50%": {
            transform: "rotate(180deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        moveVertical: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "50%": {
            transform: "translateY(50%)",
          },
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
        shimmer: "shimmer 2s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  safelist: [
    'bg-darkOliveGreen',
    'bg-forestGreen',
    'bg-darkSeaGreen',
    'bg-mossGreen',
    'bg-hunterGreen',
    'bg-darkPink',
    'bg-deepPink',
    'bg-raspberry',
    'bg-darkHotPink',
    'bg-maroon',
    'bg-indigo',
    'bg-eggplant',
    'bg-plum',
    'bg-royalPurple',
    'bg-darkOrchid',
    'bg-midnightBlue',
    'bg-navyBlue',
    'bg-darkSlateBlue',
    'bg-prussianBlue',
    'bg-royalBlue',
    'bg-darkRed',
    'bg-burgundy',
    'bg-crimson',
    'bg-firebrick',
    'bg-bloodRed',
    'bg-darkGoldenrod',
    'bg-mustard',
    'bg-olive',
    'bg-khaki',
    'bg-bronze',
    'bg-darkCyan',
    'bg-slateGray',
    'bg-deepSeaBlue',
    'bg-mahogany',
    'bg-saddleBrown',
  ],
  plugins: [require("tailwindcss-animate"), function ({ matchUtilities, theme }: any) {
    matchUtilities(
      {
        "bg-grid": (value: any) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }),
        "bg-grid-small": (value: any) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
          )}")`,
        }),
        "bg-dot": (value: any) => ({
          backgroundImage: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
          )}")`,
        }),
      },
      { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
    );
  },],
} satisfies Config

export default config