// import 'vuetify/styles'  // Commented out to prevent conflicts with Tailwind dark mode
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1E4C9A',      // Deep blue from your header
          secondary: '#E8EBF0',    // Light gray for backgrounds
          accent: '#4CAF50',       // Green for success states
          error: '#FF5252',        // Red for errors/warnings
          info: '#2196F3',         // Light blue for info
          success: '#4CAF50',      // Green for success
          warning: '#FFC107',      // Amber for warnings
          background: '#F8FAFC',   // Very light gray for main background
          surface: '#FFFFFF',      // White for cards
          'text-primary': '#1A1F36', // Dark gray for primary text
          'text-secondary': '#697386', // Medium gray for secondary text
          'border-color': '#E5E9F2' // Light gray for borders
        },
        variables: {
          'border-color': '#E5E9F2',
          'border-opacity': 0.12,
          'high-emphasis-opacity': 0.87,
          'medium-emphasis-opacity': 0.60,
          'disabled-opacity': 0.38,
          'idle-opacity': 0.04,
          'hover-opacity': 0.04,
          'focus-opacity': 0.12,
          'selected-opacity': 0.08,
          'activated-opacity': 0.12,
          'pressed-opacity': 0.12,
          'dragged-opacity': 0.08,
          'theme-kbd': '#212529',
          'theme-on-kbd': '#FFFFFF',
          'theme-code': '#F5F5F5',
          'theme-on-code': '#000000'
        }
      },
      dark: {
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107'
        }
      }
    }
  },
  defaults: {
    VCard: {
      elevation: 0,
      border: true
    },
    VBtn: {
      elevation: 0,
      rounded: 'lg'
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary'
    },
    VChip: {
      elevation: 0,
      rounded: 'lg'
    }
  }
}) 