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
            <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: 'Inter', system-ui, sans-serif;">
              {{ language === 'de' ? 'E-Mail-Adresse' : 'Email Address' }}
            </label>
            <input
              id="email"
              v-model="credentials.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-winschool-primary-dark focus:border-winschool-primary-dark bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-colors"
              style="font-family: 'Inter', system-ui, sans-serif;"
              :placeholder="language === 'de' ? 'ihre.email@winschool.de' : 'your.email@winschool.de'"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" style="font-family: 'Inter', system-ui, sans-serif;">
              {{ language === 'de' ? 'Passwort' : 'Password' }}
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-winschool-primary-dark focus:border-winschool-primary-dark bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 transition-colors"
                style="font-family: 'Inter', system-ui, sans-serif;"
                :placeholder="language === 'de' ? 'Ihr Passwort' : 'Your password'"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="credentials.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-winschool-primary-dark border-gray-300 dark:border-slate-500 rounded focus:ring-winschool-primary-dark bg-white dark:bg-slate-700 transition-colors"
              />
              <span class="ml-2 text-sm text-slate-800 dark:text-slate-300" style="font-family: 'Inter', system-ui, sans-serif;">
                {{ language === 'de' ? 'Angemeldet bleiben' : 'Remember me' }}
              </span>
            </label>
            <a href="#" class="text-sm text-winschool-primary-dark hover:text-amber-600 dark:text-winschool-primary hover:dark:text-amber-300 transition-colors" style="font-family: 'Inter', system-ui, sans-serif;">
              {{ language === 'de' ? 'Passwort vergessen?' : 'Forgot password?' }}
            </a>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-slate-800 bg-winschool-primary hover:bg-winschool-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-winschool-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style="font-family: 'Inter', system-ui, sans-serif;"
          >
            <Loader2 v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800" />
            {{ language === 'de' ? 'Anmelden' : 'Sign In' }}
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
            <button @click="setDemoCredentials('superadmin')" class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-left transition-all" style="font-family: 'Inter', system-ui, sans-serif;">
              <strong>{{ language === 'de' ? 'Super Admin' : 'Super Admin' }}</strong><br>
              <span class="text-slate-200">superadmin@winschool.de</span>
            </button>
            <button @click="setDemoCredentials('schooladmin')" class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-left transition-all" style="font-family: 'Inter', system-ui, sans-serif;">
              <strong>{{ language === 'de' ? 'Schul-Admin' : 'School Admin' }}</strong><br>
              <span class="text-slate-200">schooladmin@winschool.de</span>
            </button>
            <button @click="setDemoCredentials('student')" class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-left transition-all" style="font-family: 'Inter', system-ui, sans-serif;">
              <strong>{{ language === 'de' ? 'Schüler' : 'Student' }}</strong><br>
              <span class="text-slate-200">student@winschool.de</span>
            </button>
            <button @click="setDemoCredentials('parent')" class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-left transition-all" style="font-family: 'Inter', system-ui, sans-serif;">
              <strong>{{ language === 'de' ? 'Eltern' : 'Parent' }}</strong><br>
              <span class="text-slate-200">parent@winschool.de</span>
            </button>
            <button @click="setDemoCredentials('teacher')" class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-left transition-all" style="font-family: 'Inter', system-ui, sans-serif;">
              <strong>{{ language === 'de' ? 'Lehrer' : 'Teacher' }}</strong><br>
              <span class="text-slate-200">teacher@winschool.de</span>
            </button>
            <button @click="setDemoCredentials('schoolstaff')" class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-left transition-all" style="font-family: 'Inter', system-ui, sans-serif;">
              <strong>{{ language === 'de' ? 'Schulpersonal' : 'School Staff' }}</strong><br>
              <span class="text-slate-200">schoolstaff@winschool.de</span>
            </button>
            <button @click="setDemoCredentials('librarian')" class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-left transition-all" style="font-family: 'Inter', system-ui, sans-serif;">
              <strong>{{ language === 'de' ? 'Bibliothekar' : 'Librarian' }}</strong><br>
              <span class="text-slate-200">librarian@winschool.de</span>
            </button>
            <button @click="setDemoCredentials('principal')" class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-left transition-all" style="font-family: 'Inter', system-ui, sans-serif;">
              <strong>{{ language === 'de' ? 'Direktor' : 'Principal' }}</strong><br>
              <span class="text-slate-200">principal@winschool.de</span>
            </button>
            <button @click="setDemoCredentials('inspector')" class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-left transition-all" style="font-family: 'Inter', system-ui, sans-serif;">
              <strong>{{ language === 'de' ? 'Inspektor' : 'Inspector' }}</strong><br>
              <span class="text-slate-200">inspector@winschool.de</span>
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
          class="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 hover:text-winschool-primary-dark dark:hover:text-winschool-primary transition-colors"
          style="font-family: 'Inter', system-ui, sans-serif;"
        >
          <Globe class="h-4 w-4" />
          <span>{{ language === 'de' ? 'English' : 'Deutsch' }}</span>
        </button>
        <button 
          @click="toggleTheme"
          class="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 hover:text-winschool-primary-dark dark:hover:text-winschool-primary transition-colors"
          style="font-family: 'Inter', system-ui, sans-serif;"
        >
          <component :is="isDarkMode ? Sun : Moon" class="h-4 w-4" />
          <span>{{ isDarkMode ? (language === 'de' ? 'Hell' : 'Light') : (language === 'de' ? 'Dunkel' : 'Dark') }}</span>
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
import { GraduationCap, Loader2, Globe, Sun, Moon, Eye, EyeOff } from 'lucide-vue-next'

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
const language = computed(() => themeStore.language)

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
  themeStore.setLanguage(language.value === 'en' ? 'de' : 'en')
}

const toggleTheme = () => {
  themeStore.toggleDarkMode()
}
</script>
