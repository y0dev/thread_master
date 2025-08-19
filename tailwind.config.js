/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false, // Force light mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#171717',
        muted: '#f5f5f5',
        'muted-foreground': '#737373',
        border: '#e5e5e5',
        primary: '#2563eb',
        'primary-foreground': '#ffffff',
        secondary: '#f3f4f6',
        'secondary-foreground': '#1f2937',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
