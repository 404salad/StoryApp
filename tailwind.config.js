/** @type {import('tailwindcss').Config} */

export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
  extend: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'sky': '#78d0ff',
      'sun': '#FFDD00',
      'grass': '#84cc16',
      'bgd': '#E1D7C6',
      'primary': '#CDC2A5',
    },
    fontFamily: {
      // 'cute': ['Oswald'],
    }

  
  },
};
export const plugins = [];