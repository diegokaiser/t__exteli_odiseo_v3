/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}', // Muy bien si estás usando Tailwind sobre PrimeReact
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
