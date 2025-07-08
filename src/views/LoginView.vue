<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="flex justify-center">
          <div class="h-12 w-12 bg-winschool-primary rounded-xl flex items-center justify-center shadow-lg border border-winschool-primary-dark">
            <GraduationCap class="h-8 w-8 text-slate-800" />
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-semibold text-slate-800 dark:text-white" style="font-family: 'Inter', system-ui, sans-serif;">
          {{ language === 'de' ? 'Anmelden bei WinSchool' : 'Sign in to WinSchool' }}
        </h2>
        <p class="mt-2 text-center text-sm text-slate-600 dark:text-slate-300" style="font-family: 'Inter', system-ui, sans-serif;">
          {{ language === 'de' ? 'Willkommen zurück! Bitte melden Sie sich an.' : 'Welcome back! Please sign in to your account.' }}
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 space-y-4 border border-slate-200 dark:border-slate-700">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300" style="font-family: 'Inter', system-ui, sans-serif;">
              {{ language === 'de' ? 'E-Mail-Adresse' : 'Email Address' }}
            </label>
            <input
              type="text"
              id="email"
              v-model="credentials.email"
              class="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:text-sm"
              :placeholder="language === 'de' ? 'ihre.email@winschool.de' : 'your.email@winschool.de'"
              required
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300" style="font-family: 'Inter', system-ui, sans-serif;">
              {{ language === 'de' ? 'Passwort' : 'Password' }}
            </label>
            <div class="relative mt-1">
              <input
                type="password"
                id="password"
                v-model="credentials.password"
                class="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:text-sm"
                :placeholder="language === 'de' ? 'Ihr Passwort' : 'Your password'"
                required
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                v-model="credentials.rememberMe"
                class="h-4 w-4 text-winschool-primary-dark focus:ring-winschool-primary-dark border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600 dark:ring-offset-slate-800 dark:focus:ring-offset-slate-800"
              />
              <label for="rememberMe" class="ml-2 block text-sm text-slate-700 dark:text-slate-300" style="font-family: 'Inter', system-ui, sans-serif;">
                {{ language === 'de' ? 'Angemeldet bleiben' : 'Remember me' }}
              </label>
            </div>
            <a href="#" class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400" style="font-family: 'Inter', system-ui, sans-serif;">
              {{ language === 'de' ? 'Passwort vergessen?' : 'Forgot password?' }}
            </a>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-winschool-primary hover:bg-winschool-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-winschool-primary-dark"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          >
            <span v-if="!isLoading">{{ language === 'de' ? 'Anmelden' : 'Sign In' }}</span>
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </form>

      <!-- Apply Now Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-slate-600 dark:text-slate-400" style="font-family: 'Inter', system-ui, sans-serif;">
          {{ language === 'de' ? 'Neuer Schüler?' : 'New student?' }}
          <router-link to="/apply" class="text-winschool-primary-dark hover:text-amber-600 font-medium transition-colors ml-1" style="font-family: 'Inter', system-ui, sans-serif;">
            {{ language === 'de' ? 'Jetzt bewerben' : 'Apply now' }}
          </router-link>
        </p>
      </div>

      <!-- Demo Info -->
      <div class="mt-6 p-4 bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg border border-slate-600">
        <p class="text-sm text-white font-medium mb-2" style="font-family: 'Inter', system-ui, sans-serif;">
          {{ language === 'de' ? 'Demo-Zugang:' : 'Demo Access:' }}
        </p>
        <div class="space-y-2 text-xs text-white">
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="setDemoCredentials('superadmin')"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            >
              {{ language === 'de' ? 'Super Admin' : 'Super Admin' }}
            </button>
            <button
              @click="setDemoCredentials('schooladmin')"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            >
              {{ language === 'de' ? 'Schul-Admin' : 'School Admin' }}
            </button>
            <button
              @click="setDemoCredentials('student')"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            >
              {{ language === 'de' ? 'Schüler' : 'Student' }}
            </button>
            <button
              @click="setDemoCredentials('parent')"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            >
              {{ language === 'de' ? 'Eltern' : 'Parent' }}
            </button>
            <button
              @click="setDemoCredentials('teacher')"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            >
              {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
            </button>
            <button
              @click="setDemoCredentials('schoolstaff')"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            >
              {{ language === 'de' ? 'Schulpersonal' : 'School Staff' }}
            </button>
            <button
              @click="setDemoCredentials('librarian')"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            >
              {{ language === 'de' ? 'Bibliothekar' : 'Librarian' }}
            </button>
            <button
              @click="setDemoCredentials('principal')"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            >
              {{ language === 'de' ? 'Direktor' : 'Principal' }}
            </button>
            <button
              @click="setDemoCredentials('inspector')"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            >
              {{ language === 'de' ? 'Inspektor' : 'Inspector' }}
            </button>
          </div>
          <p class="text-center mt-2 text-slate-200" style="font-family: 'Inter', system-ui, sans-serif;">
            {{ language === 'de' ? 'Passwort: demo123 (für alle Rollen)' : 'Password: demo123 (for all roles)' }}
          </p>
        </div>
      </div>

      <!-- Language and Theme Toggle -->
      <div class="flex justify-center space-x-4">
        <button
          @click="toggleLanguage"
          class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400"
          style="font-family: 'Inter', system-ui, sans-serif;"
        >
          {{ language === 'de' ? 'English' : 'Deutsch' }}
        </button>
        <button
          @click="toggleTheme"
          class="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400"
          style="font-family: 'Inter', system-ui, sans-serif;"
        >
          {{ isDarkMode ? (language === 'de' ? 'Hell' : 'Light') : (language === 'de' ? 'Dunkel' : 'Dark') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { GraduationCap, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const credentials = ref({
  email: '',
  password: '',
  rememberMe: false
})
const isLoading = ref(false)
const showPassword = ref(false)

const isDarkMode = computed(() => themeStore.isDarkMode)
const language = themeStore.language

const setDemoCredentials = (role: string) => {
  const demoCredentials = {
    superadmin: 'superadmin@winschool.de',
    schooladmin: 'schooladmin@winschool.de',
    student: 'student@winschool.de', 
    parent: 'parent@winschool.de',
    teacher: 'teacher@winschool.de',
    schoolstaff: 'schoolstaff@winschool.de',
    librarian: 'librarian@winschool.de',
    principal: 'principal@winschool.de',
    inspector: 'inspector@winschool.de'
  }
  
  credentials.value.email = demoCredentials[role as keyof typeof demoCredentials] || ''
  credentials.value.password = 'demo123'
}

const handleLogin = async () => {
  if (!credentials.value.email || !credentials.value.password) {
    return
  }
  
  isLoading.value = true
  
  try {
    await authStore.login(credentials.value.email, credentials.value.password)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleLanguage = () => {
  themeStore.setLanguage(language === 'en' ? 'de' : 'en')
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>
