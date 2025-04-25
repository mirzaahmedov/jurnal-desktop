import type { Config } from 'tailwindcss'

import plugin from 'tailwindcss/plugin'

const ui = plugin(function ({ addUtilities }) {
  addUtilities({
    '.btn-icon': {
      'vertical-align': 'middle',
      width: '1.125rem',
      height: '1.125rem'
    },
    '.icon-start': {
      'margin-right': '0.5rem'
    },

    '.noscroll-bar': {
      'scrollbar-width': 'none'
    },
    '.noscroll-bar::-webkit-scrollbar': {
      width: '0',
      height: '0'
    },

    '.scrollbar': {
      'scrollbar-width': 'thin',
      'scrollbar-color': 'hsl(var(--scrollbar)) hsl(var(--background))'
    },
    '.scrollbar::-webkit-scrollbar': {
      width: '6px',
      height: '6px'
    },
    '.scrollbar::-webkit-scrollbar-thumb': {
      'background-color': 'hsl(var(--scrollbar))',
      'border-radius': '3px'
    },
    '.scrollbar::-webkit-scrollbar-track': {
      'background-color': 'hsl(var(--background))'
    },

    '.table-xs input': {
      'font-size': '0.75rem',
      'font-weight': '600',
      padding: '0.375rem'
    },
    '.table-xs th': {
      'font-size': '0.75rem',
      padding: '0.375rem'
    },

    '.table-generic-xs td': {
      'font-size': '0.75rem',
      'padding-left': '0.75rem',
      'padding-right': '0.75rem',
      'padding-top': '0.5rem',
      'padding-bottom': '0.5rem'
    },
    '.table-generic-xs th': {
      'font-size': '0.75rem',
      'padding-left': '0.75rem',
      'padding-right': '0.75rem',
      'padding-top': '0.5rem',
      'padding-bottom': '0.5rem'
    },

    '.tree_node': {
      position: 'relative'
    },
    '.tree_node::before, .tree_node::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '0',
      top: '0',
      width: '0',
      'padding-left': '20px',
      'border-left-width': '1px',
      'border-left-style': 'solid'
    },
    '.tree_node::before': {
      height: '50%',
      'border-bottom-width': '1px',
      'border-bottom-style': 'solid',
      'border-bottom-left-radius': '0.25rem'
    },
    '.tree_node::after': {
      height: '100%'
    },
    '.tree_node:last-child::after': {
      height: '0%'
    },

    '.titlecase': {
      'text-transform': 'lowercase'
    },
    '.titlecase::first-letter': {
      'text-transform': 'uppercase'
    },

    '.loader': {
      '--d': '22px',
      width: '4px',
      height: '4px',
      'border-radius': '50%',
      color: 'hsl(var(--brand))',
      'box-shadow': `calc(1 * var(--d)) calc(0 * var(--d)) 0 0,
        calc(0.707 * var(--d)) calc(0.707 * var(--d)) 0 1px,
        calc(0 * var(--d)) calc(1 * var(--d)) 0 2px,
        calc(-0.707 * var(--d)) calc(0.707 * var(--d)) 0 3px,
        calc(-1 * var(--d)) calc(0 * var(--d)) 0 4px,
        calc(-0.707 * var(--d)) calc(-0.707 * var(--d)) 0 5px,
        calc(0 * var(--d)) calc(-1 * var(--d)) 0 6px;
      animation: loader 1s infinite steps(8)`
    },

    '.before-indicator': {
      position: 'relative'
    },
    '.before-indicator::before': {
      content: "''",
      position: 'absolute',
      left: '-1.1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0.2rem',
      height: '2rem',
      borderRadius: '10rem',
      backgroundColor: 'currentColor'
    }
  })
})

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.tsx', './src/**/*.ts'],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem'
      },
      boxShadow: {
        up: '0px -5px 15px 9px rgba(148, 163, 184, 0.1)',
        down: '0px 5px 15px 9px rgba(148, 163, 184, 0.1)',
        right: '10px 0px 17px 0px rgba(0,0,0,0.05)',
        left: '-10px 0px 17px 0px rgba(0,0,0,0.05)',
        'sm-up': '0 -1px 3px 0 rgb(0 0 0 / 0.1), 0 -1px 2px -1px rgb(0 0 0 / 0.1)',
        'sm-left': '-2px 0 5px 0 rgb(0 0 0 / 0.1), -2px 0 5px -2px rgb(0 0 0 / 0.1)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      maxWidth: {
        '8xl': '90rem'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'foreground-muted': 'hsl(var(--foreground-muted))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          foreground: 'hsl(var(--brand-foreground))'
        },
        highlight: {
          DEFAULT: 'hsl(var(--highlight))',
          divider: 'hsl(var(--highlight-divider))',
          neutral: 'hsl(var(--highlight-neutral))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
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
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        }
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '20%': { transform: 'translateX(-4px) rotate(-5deg)' },
          '40%': { transform: 'translateX(4px) rotate(5deg)' },
          '60%': { transform: 'translateX(-4px) rotate(-5deg)' },
          '80%': { transform: 'translateX(4px) rotate(5deg)' }
        },
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
        },
        loader: {
          '100%': { transform: 'rotate(1turn)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shake: 'shake 0.4s ease-in-out 2'
      },
      zIndex: {
        100: '100',
        150: '150'
      }
    }
  },
  plugins: [require('tailwindcss-animate'), ui]
}

export default config
