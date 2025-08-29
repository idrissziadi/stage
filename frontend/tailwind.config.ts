import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))',
					dark: 'hsl(var(--primary-dark))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					light: 'hsl(var(--secondary-light))',
					dark: 'hsl(var(--secondary-dark))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: 'hsl(var(--success))',
				warning: 'hsl(var(--warning))',
				info: 'hsl(var(--info))',
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				neutral: {
					50: 'hsl(var(--neutral-50))',
					100: 'hsl(var(--neutral-100))',
					200: 'hsl(var(--neutral-200))',
					300: 'hsl(var(--neutral-300))',
					400: 'hsl(var(--neutral-400))',
					500: 'hsl(var(--neutral-500))',
					600: 'hsl(var(--neutral-600))',
					700: 'hsl(var(--neutral-700))',
					800: 'hsl(var(--neutral-800))',
					900: 'hsl(var(--neutral-900))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-subtle': 'var(--gradient-subtle)'
			},
			boxShadow: {
				'sm': 'var(--shadow-sm)',
				'base': 'var(--shadow-base)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)'
			},
			fontFamily: {
				'sans': ['Cairo', 'Noto Sans Arabic', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
				'arabic': ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'rtl-2': '0.5rem',
				'rtl-4': '1rem',
				'rtl-6': '1.5rem',
				'rtl-8': '2rem'
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
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-in-rtl': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'bounce-custom': {
					'0%, 100%': { transform: 'translateY(-25%)' },
					'50%': { transform: 'translateY(0)' }
				},
				'pulse-custom': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'slide-in-rtl': 'slide-in-rtl 0.3s ease-out',
				'bounce-custom': 'bounce-custom 1s infinite',
				'pulse-custom': 'pulse-custom 2s infinite'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Add custom RTL utilities
		function({ addUtilities }: any) {
			addUtilities({
				'.rtl': {
					direction: 'rtl',
				},
				'.ltr': {
					direction: 'ltr',
				},
				'.text-start-rtl': {
					'text-align': 'right',
					'[dir="ltr"] &': {
						'text-align': 'left',
					},
				},
				'.text-end-rtl': {
					'text-align': 'left',
					'[dir="ltr"] &': {
						'text-align': 'right',
					},
				},
				'.mr-auto-rtl': {
					'margin-left': 'auto',
					'[dir="ltr"] &': {
						'margin-right': 'auto',
						'margin-left': '0',
					},
				},
				'.ml-auto-rtl': {
					'margin-right': 'auto',
					'[dir="ltr"] &': {
						'margin-left': 'auto',
						'margin-right': '0',
					},
				},
				'.float-start-rtl': {
					float: 'right',
					'[dir="ltr"] &': {
						float: 'left',
					},
				},
				'.float-end-rtl': {
					float: 'left',
					'[dir="ltr"] &': {
						float: 'right',
					},
				},
				'.border-s-rtl': {
					'border-right-width': '1px',
					'[dir="ltr"] &': {
						'border-left-width': '1px',
						'border-right-width': '0',
					},
				},
				'.border-e-rtl': {
					'border-left-width': '1px',
					'[dir="ltr"] &': {
						'border-right-width': '1px',
						'border-left-width': '0',
					},
				},
				'.ps-rtl-4': {
					'padding-right': '1rem',
					'[dir="ltr"] &': {
						'padding-left': '1rem',
						'padding-right': '0',
					},
				},
				'.pe-rtl-4': {
					'padding-left': '1rem',
					'[dir="ltr"] &': {
						'padding-right': '1rem',
						'padding-left': '0',
					},
				},
				'.ms-rtl-2': {
					'margin-right': '0.5rem',
					'[dir="ltr"] &': {
						'margin-left': '0.5rem',
						'margin-right': '0',
					},
				},
				'.me-rtl-2': {
					'margin-left': '0.5rem',
					'[dir="ltr"] &': {
						'margin-right': '0.5rem',
						'margin-left': '0',
					},
				},
			});
		}
	],
} satisfies Config;
