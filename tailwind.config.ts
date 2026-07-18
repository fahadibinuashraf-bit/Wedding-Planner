import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        emerald: {
          DEFAULT: "#059669",
          light: "#10B981",
          dark: "#047857",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F5E6A3",
          dark: "#B8960C",
        },
        ivory: "#FFFEF7",
        champagne: "#F7E7CE",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 8px 32px -8px rgba(0, 0, 0, 0.12)",
        gold: "0 0 0 1px rgba(212, 175, 55, 0.3)",
      },
      backgroundImage: {
        "gradient-emerald-gold":
          "linear-gradient(135deg, #059669 0%, #10B981 50%, #D4AF37 100%)",
        "gradient-mehendi":
          "linear-gradient(135deg, #15803d 0%, #059669 50%, #84cc16 100%)",
        "gradient-haldi":
          "linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #fb923c 100%)",
        "gradient-nikah":
          "linear-gradient(135deg, #047857 0%, #059669 50%, #D4AF37 100%)",
        "gradient-reception":
          "linear-gradient(135deg, #fef3c7 0%, #F7E7CE 50%, #fde68a 100%)",
        "gradient-destination":
          "linear-gradient(135deg, #0d9488 0%, #059669 50%, #06b6d4 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
