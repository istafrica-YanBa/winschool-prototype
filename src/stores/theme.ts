import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(false)
  const language = ref<'en' | 'de'>('en')

  const applyTheme = (darkMode: boolean) => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    applyTheme(isDarkMode.value)
    localStorage.setItem('winschool_theme', isDarkMode.value ? 'dark' : 'light')
  }

  const setLanguage = (lang: 'en' | 'de') => {
    language.value = lang
    localStorage.setItem('winschool_language', lang)
  }

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('winschool_theme')
    const savedLanguage = localStorage.getItem('winschool_language')
    
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDarkMode.value = prefersDark
    }
    
    // Apply the theme immediately
    applyTheme(isDarkMode.value)
    
    if (savedLanguage) {
      language.value = savedLanguage as 'en' | 'de'
    }
  }

  return {
    isDarkMode,
    language,
    toggleTheme,
    setLanguage,
    initializeTheme
  }
})