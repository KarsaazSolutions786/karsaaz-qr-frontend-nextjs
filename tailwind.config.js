/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', 'class'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#f6f1ff',
  				'100': '#ede5ff',
  				'200': '#d9c8ff',
  				'300': '#b99dff',
  				'400': '#9a72f5',
  				'500': '#8368dc',
  				'600': '#7050c4',
  				'700': '#5d3dab',
  				'800': '#4d3290',
  				'900': '#3d2876',
  				'950': '#261754',
  				DEFAULT: '#8368dc'
  			},
  			accent: {
  				DEFAULT: '#b664c6',
  				light: '#c98dd5',
  				foreground: '#6b4a78'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
}

