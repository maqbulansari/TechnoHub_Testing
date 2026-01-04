/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx}"],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'100': '#ECEFFC',
  				'200': '#D8DFF9',
  				'300': '#C5CFF6',
  				'400': '#B1BFF3',
  				'500': '#9EAFF0',
  				'600': '#8B9EED',
  				'700': '#778EEA',
  				'800': '#647EE7',
  				'900': '#506EE4',
  				DEFAULT: 'hsl(var(--primary))',
  				hover: '#2D4ED1',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'100': '#F1FAFB',
  				'200': '#E2F5F7',
  				'300': '#D4F0F3',
  				'400': '#C5EBEF',
  				'500': '#B7E6EC',
  				'600': '#A9E0E8',
  				'700': '#9ADBE4',
  				'800': '#8CD6E0',
  				'900': '#7DD1DC',
  				DEFAULT: 'hsl(var(--secondary))',
  				hover: '#5FBCC8',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			success: {
  				'100': '#E8F9E8',
  				'200': '#D1F2D1',
  				'300': '#BAECB9',
  				'400': '#A3E5A2',
  				'500': '#8DDF8B',
  				'600': '#76D874',
  				'700': '#5FD25D',
  				'800': '#48CB45',
  				'900': '#1ABE17',
  				DEFAULT: '#1ABE17',
  				hover: '#15A012'
  			},
  			info: {
  				'100': '#E7F1FC',
  				'200': '#CFE2FA',
  				'300': '#B8D4F7',
  				'400': '#A0C6F4',
  				'500': '#88B8F2',
  				'600': '#70A9EF',
  				'700': '#589BEC',
  				'800': '#418DE9',
  				'900': '#1170E4',
  				DEFAULT: '#0F65CD',
  				hover: '#0E55BD'
  			},
  			warning: {
  				DEFAULT: '#EAB300',
  				hover: '#DAA300'
  			},
  			danger: {
  				'100': '#FDE9ED',
  				'200': '#FAD4DA',
  				'300': '#F8BEC8',
  				'400': '#F5A9B5',
  				'500': '#F393A3',
  				'600': '#F07E91',
  				'700': '#EE687E',
  				'800': '#EB536C',
  				'900': '#E82646',
  				DEFAULT: '#E82646',
  				hover: '#D81636'
  			},
  			dark: '#202C4B',
  			light: '#E9EDF4',
  			sidebar: {
  				blue: '#07396D',
  				dark: '#39435F'
  			},
  			skyblue: '#05C3FB',
  			pending: '#05C3FB',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			primary: [
  				'Roboto',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			base: '14px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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

  plugins: [require('daisyui'), require("tailwindcss-animate")],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#3D5EE1',
          secondary: '#6FCCD8',
          accent: '#05C3FB',
          neutral: '#202C4B',
          'base-100': '#FFFFFF',
          info: '#0F65CD',
          success: '#1ABE17',
          warning: '#EAB300',
          error: '#E82646',
        },
        dark: {
          primary: '#3D5EE1',
          secondary: '#6FCCD8',
          accent: '#05C3FB',
          neutral: '#171724',
          'base-100': '#1d1d42',
          info: '#0F65CD',
          success: '#1ABE17',
          warning: '#EAB300',
          error: '#E82646',
        },
      },
    ],
  },
}
