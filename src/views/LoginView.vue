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
          <RuneInput
            id="email"
            v-model="credentials.email"
            type="text"
            :label="language === 'de' ? 'E-Mail-Adresse' : 'Email Address'"
            :placeholder="language === 'de' ? 'ihre.email@winschool.de' : 'your.email@winschool.de'"
            required
          />

          <!-- Password Input -->
          <div>
            <RuneInput
              id="password"
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'text'"
              :label="language === 'de' ? 'Passwort' : 'Password'"
              :placeholder="language === 'de' ? 'Ihr Passwort' : 'Your password'"
              required
            />
            <div class="relative">
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
            <RuneCheckbox
              v-model="credentials.rememberMe"
              :label="language === 'de' ? 'Angemeldet bleiben' : 'Remember me'"
              wcag-label="Remember me checkbox"
            />
            <RuneLink
              href="#"
              wcag-label="Forgot password link"
            >
              {{ language === 'de' ? 'Passwort vergessen?' : 'Forgot password?' }}
            </RuneLink>
          </div>

          <!-- Login Button -->
          <RuneButton
            type="submit"
            :disabled="isLoading"
            :text="language === 'de' ? 'Anmelden' : 'Sign In'"
            variant="primary"
            size="lg"
            :loading="isLoading"
            loading-placement="left"
            wcag-label="Sign in button"
            class="w-full"
          />
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
            <RuneButton
              @click="setDemoCredentials('superadmin')"
              :text="language === 'de' ? 'Super Admin' : 'Super Admin'"
              variant="secondary"
              size="sm"
              wcag-label="Demo super admin button"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            />
            <RuneButton
              @click="setDemoCredentials('schooladmin')"
              :text="language === 'de' ? 'Schul-Admin' : 'School Admin'"
              variant="secondary"
              size="sm"
              wcag-label="Demo school admin button"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            />
            <RuneButton
              @click="setDemoCredentials('student')"
              :text="language === 'de' ? 'Schüler' : 'Student'"
              variant="secondary"
              size="sm"
              wcag-label="Demo student button"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            />
            <RuneButton
              @click="setDemoCredentials('parent')"
              :text="language === 'de' ? 'Eltern' : 'Parent'"
              variant="secondary"
              size="sm"
              wcag-label="Demo parent button"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            />
            <RuneButton
              @click="setDemoCredentials('teacher')"
              :text="language === 'de' ? 'Lehrer' : 'Teacher'"
              variant="secondary"
              size="sm"
              wcag-label="Demo teacher button"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            />
            <RuneButton
              @click="setDemoCredentials('schoolstaff')"
              :text="language === 'de' ? 'Schulpersonal' : 'School Staff'"
              variant="secondary"
              size="sm"
              wcag-label="Demo school staff button"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            />
            <RuneButton
              @click="setDemoCredentials('librarian')"
              :text="language === 'de' ? 'Bibliothekar' : 'Librarian'"
              variant="secondary"
              size="sm"
              wcag-label="Demo librarian button"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            />
            <RuneButton
              @click="setDemoCredentials('principal')"
              :text="language === 'de' ? 'Direktor' : 'Principal'"
              variant="secondary"
              size="sm"
              wcag-label="Demo principal button"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            />
            <RuneButton
              @click="setDemoCredentials('inspector')"
              :text="language === 'de' ? 'Inspektor' : 'Inspector'"
              variant="secondary"
              size="sm"
              wcag-label="Demo inspector button"
              class="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-left transition-all"
            />
          </div>
          <p class="text-center mt-2 text-slate-200" style="font-family: 'Inter', system-ui, sans-serif;">
            {{ language === 'de' ? 'Passwort: demo123 (für alle Rollen)' : 'Password: demo123 (for all roles)' }}
          </p>
        </div>
      </div>

      <!-- Language and Theme Toggle -->
      <div class="flex justify-center space-x-4">
        <RuneButton
          @click="toggleLanguage"
          :text="language === 'de' ? 'English' : 'Deutsch'"
          variant="tertiary"
          size="sm"
          :icon="{ left: 'globe-alt' }"
          wcag-label="Toggle language button"
        />
        <RuneButton
          @click="toggleTheme"
          :text="isDarkMode ? (language === 'de' ? 'Hell' : 'Light') : (language === 'de' ? 'Dunkel' : 'Dark')"
          variant="tertiary"
          size="sm"
          :icon="{ left: isDarkMode ? 'sun' : 'moon' }"
          wcag-label="Toggle theme button"
        />
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
import { RuneButton, RuneInput, RuneCheckbox, RuneLink } from '@ist/commonui-components'

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
  themeStore.toggleTheme()
}
</script>
