/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Color System - Warm Yellow (#fef3c7)
        primary: {
          50: '#fffef5',
          100: '#fffde7',
          200: '#fef9c3',
          300: '#fef3c7', // Main primary color - warm yellow
          400: '#fde68a',
          500: '#facc15',
          600: '#eab308',
          700: '#ca8a04',
          800: '#a16207',
          900: '#854d0e',
        },
        // Custom exact colors from specification - updated for new primary
        'winschool-primary': '#fef3c7', // New primary yellow
        'winschool-primary-dark': '#facc15', // Darker yellow for hover states
        'winschool-content': '#334155', // Slate-800 - Default content text
        'winschool-heading': '#64748B', // Slate-500 - Headings & section titles
        'winschool-sidebar': '#475569', // Slate-600 - Sidebar icons/labels
        'winschool-bg': '#F8FAFC', // Slate-50 - Primary page background
        'winschool-success': '#22C55E', // Green - Success states
        'winschool-warning': '#FACC15', // Yellow - Warning states
        'winschool-error': '#EF4444', // Red - Error states
        'winschool-info': '#3B82F6', // Blue - Info/Progress
        'winschool-neutral': '#E5E7EB', // Gray - Neutral/Disabled
        'winschool-dark-bg': '#0F172A', // Slate-900 - Dark mode background
        'winschool-light-text': '#F8FAFC', // Slate-50 - Light text on dark backgrounds
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body': ['14px', {
          lineHeight: '163%',
          letterSpacing: '0%',
          fontWeight: '400',
        }],
        'body-large': ['16px', {
          lineHeight: '163%',
          letterSpacing: '0%',
          fontWeight: '400',
        }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backgroundColor: {
        'page': '#F8FAFC', // Primary page background
        'card': '#FFFFFF', // Component cards & panels
        'sidebar-light': '#FFFFFF', // Sidebar light mode
        'sidebar-dark': '#1E293B', // Sidebar dark mode (Slate-800)
      },
      textColor: {
        'content': '#334155', // Default content text (Slate-800)
        'heading': '#64748B', // Headings & section titles (Slate-500)
        'sidebar': '#475569', // Sidebar icons/labels (Slate-600)
        'hover': '#F8FAFC', // Hover/tooltip text on dark backgrounds
      },
    },
  },
  plugins: [],
}