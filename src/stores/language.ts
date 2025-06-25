import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLanguageStore = defineStore('language', () => {
  const language = ref<'en' | 'de'>('en')

  const setLanguage = (lang: 'en' | 'de') => {
    language.value = lang
    localStorage.setItem('winschool_language', lang)
  }

  const initializeLanguage = () => {
    const savedLanguage = localStorage.getItem('winschool_language')
    if (savedLanguage) {
      language.value = savedLanguage as 'en' | 'de'
    }
  }

  // Initialize language on store creation
  initializeLanguage()

  return {
    language: computed(() => language.value),
    setLanguage,
    initializeLanguage
  }
}) 