<template>
  <div class="profile bg-gray-50 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <User class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Mein Profil' : 'My Profile' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Ihre persönlichen Informationen und Einstellungen' : 'Manage your personal information and settings' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="saveProfile" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Save class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Speichern' : 'Save' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Grundinformationen' : 'Basic Information' }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Vorname' : 'First Name' }}
                </label>
                <input
                  v-model="profile.firstName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Nachname' : 'Last Name' }}
                </label>
                <input
                  v-model="profile.lastName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'E-Mail' : 'Email' }}
                </label>
                <input
                  v-model="profile.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Telefon' : 'Phone' }}
                </label>
                <input
                  v-model="profile.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Sicherheitseinstellungen' : 'Security Settings' }}
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Aktuelles Passwort' : 'Current Password' }}
                </label>
                <input
                  v-model="security.currentPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Neues Passwort' : 'New Password' }}
                </label>
                <input
                  v-model="security.newPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Passwort bestätigen' : 'Confirm Password' }}
                </label>
                <input
                  v-model="security.confirmPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button class="btn-primary">
                {{ language === 'de' ? 'Passwort aktualisieren' : 'Update Password' }}
              </button>
            </div>
          </div>

          <!-- Notification Preferences -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Benachrichtigungseinstellungen' : 'Notification Preferences' }}
            </h2>
            <div class="space-y-4">
              <div v-for="notification in notifications" :key="notification.id" class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ notification.description }}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="notification.enabled"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Picture and Quick Info -->
        <div class="space-y-6">
          <!-- Profile Picture -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Profilbild' : 'Profile Picture' }}
            </h2>
            <div class="text-center">
              <img
                :src="user?.avatar"
                :alt="user?.name"
                class="h-24 w-24 rounded-full object-cover mx-auto mb-4"
              />
              <button class="btn-secondary text-sm">
                {{ language === 'de' ? 'Bild ändern' : 'Change Picture' }}
              </button>
            </div>
          </div>

          <!-- Role Information -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Rolleninformationen' : 'Role Information' }}
            </h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Rolle' : 'Role' }}</p>
                <p class="font-medium text-gray-900 dark:text-white capitalize">{{ getRoleDisplayName(user?.role) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Institution' : 'Institution' }}</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ user?.institution }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Benutzer-ID' : 'User ID' }}</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ user?.id }}</p>
              </div>
            </div>
          </div>

          <!-- Theme Settings -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Darstellungseinstellungen' : 'Appearance Settings' }}
            </h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Dunkler Modus' : 'Dark Mode' }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ language === 'de' ? 'Dunkles Design verwenden' : 'Use dark theme' }}
                  </p>
                </div>
                <button @click="toggleTheme" class="btn-secondary text-sm">
                  {{ isDarkMode ? (language === 'de' ? 'Hell' : 'Light') : (language === 'de' ? 'Dunkel' : 'Dark') }}
                </button>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ language === 'de' ? 'Sprache' : 'Language' }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ language === 'de' ? 'Anzeigesprache wählen' : 'Choose display language' }}
                  </p>
                </div>
                <button @click="toggleLanguage" class="btn-secondary text-sm">
                  {{ language === 'de' ? 'English' : 'Deutsch' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { User, Save } from 'lucide-vue-next'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const user = computed(() => authStore.user)
const language = computed(() => themeStore.language)
const isDarkMode = computed(() => themeStore.isDarkMode)

const profile = ref({
  firstName: user.value?.name?.split(' ')[0] || '',
  lastName: user.value?.name?.split(' ')[1] || '',
  email: user.value?.email || '',
  phone: '+49 123 456 7890'
})

const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notifications = ref([
  {
    id: 1,
    title: language.value === 'de' ? 'E-Mail-Benachrichtigungen' : 'Email Notifications',
    description: language.value === 'de' ? 'Erhalten Sie Updates per E-Mail' : 'Receive updates via email',
    enabled: true
  },
  {
    id: 2,
    title: language.value === 'de' ? 'Push-Benachrichtigungen' : 'Push Notifications',
    description: language.value === 'de' ? 'Sofortige Benachrichtigungen' : 'Instant notifications',
    enabled: false
  },
  {
    id: 3,
    title: language.value === 'de' ? 'SMS-Benachrichtigungen' : 'SMS Notifications',
    description: language.value === 'de' ? 'Wichtige Updates per SMS' : 'Important updates via SMS',
    enabled: true
  }
])

const getRoleDisplayName = (role?: string) => {
  const roleNames = {
    en: {
      student: 'Student',
      parent: 'Parent/Guardian',
      teacher: 'Teacher',
      admin: 'Administrator',
      principal: 'Principal',
      inspector: 'Educational Inspector',
      schoolstaff: 'School Staff',
      superadmin: 'Super Administrator',
      schooladmin: 'School Administrator'
    },
    de: {
      student: 'Schüler',
      parent: 'Eltern/Erziehungsberechtigte',
      teacher: 'Lehrer',
      admin: 'Administrator',
      principal: 'Schulleiter',
      inspector: 'Bildungsinspektor',
      schoolstaff: 'Schulpersonal',
      superadmin: 'Super-Administrator',
      schooladmin: 'Schuladministrator'
    }
  }
  
  return roleNames[language.value][role as keyof typeof roleNames.en] || role
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const toggleLanguage = () => {
  themeStore.setLanguage(language.value === 'en' ? 'de' : 'en')
}

const saveProfile = () => {
  // Implementation of saveProfile function
  console.log('Profile saved:', profile.value)
  // You can add actual save logic here
}
</script>
