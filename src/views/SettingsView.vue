<template>
  <div class="settings-view space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Settings class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Einstellungen' : 'Settings' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Systemeinstellungen und Konfiguration verwalten' : 'Manage system settings and configuration' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="saveSettings" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Save class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Einstellungen speichern' : 'Save Settings' }}
        </button>
        <button @click="resetSettings" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <RotateCcw class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Zurücksetzen' : 'Reset' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Appearance Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Palette class="h-5 w-5 mr-2 text-primary-600" />
          {{ language === 'de' ? 'Darstellung' : 'Appearance' }}
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
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="isDarkMode"
                @change="toggleTheme"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
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
            <select 
              :value="language"
              @change="handleLanguageChange"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Bell class="h-5 w-5 mr-2 text-secondary-600" />
          {{ language === 'de' ? 'Benachrichtigungen' : 'Notifications' }}
        </h2>
        <div class="space-y-4">
          <div v-for="notification in notificationSettings" :key="notification.id" class="flex items-center justify-between">
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

      <!-- Security Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield class="h-5 w-5 mr-2 text-accent-600" />
          {{ language === 'de' ? 'Sicherheit' : 'Security' }}
        </h2>
        <div class="space-y-4">
          <button class="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Passwort ändern' : 'Change Password' }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'Letztes Update vor 3 Monaten' : 'Last updated 3 months ago' }}
                </p>
              </div>
              <ChevronRight class="h-4 w-4 text-gray-400" />
            </div>
          </button>
          
          <button class="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Zwei-Faktor-Authentifizierung' : 'Two-Factor Authentication' }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'Zusätzliche Sicherheit aktivieren' : 'Enable additional security' }}
                </p>
              </div>
              <span class="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                {{ language === 'de' ? 'Aktiv' : 'Active' }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- System Preferences -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Settings class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Systemeinstellungen' : 'System Preferences' }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Zeitzone' : 'Timezone' }}
            </label>
            <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>Europe/Berlin</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Datumsformat' : 'Date Format' }}
            </label>
            <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>DD.MM.YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Währung' : 'Currency' }}
            </label>
            <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>EUR (€)</option>
              <option>USD ($)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Sitzungsdauer' : 'Session Timeout' }}
            </label>
            <select class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>4 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Data & Privacy -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Database class="h-5 w-5 mr-2 text-green-600" />
        {{ language === 'de' ? 'Daten & Datenschutz' : 'Data & Privacy' }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <button class="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Daten exportieren' : 'Export Data' }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'Laden Sie Ihre Daten herunter' : 'Download your data' }}
                </p>
              </div>
              <Download class="h-5 w-5 text-gray-400" />
            </div>
          </button>
          
          <button class="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Datenschutzeinstellungen' : 'Privacy Settings' }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'DSGVO-Einstellungen verwalten' : 'Manage GDPR settings' }}
                </p>
              </div>
              <ChevronRight class="h-4 w-4 text-gray-400" />
            </div>
          </button>
        </div>
        
        <div class="space-y-4">
          <button class="w-full text-left p-4 border border-red-200 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-red-600 dark:text-red-400">
                  {{ language === 'de' ? 'Konto löschen' : 'Delete Account' }}
                </h3>
                <p class="text-sm text-red-500 dark:text-red-400">
                  {{ language === 'de' ? 'Konto dauerhaft entfernen' : 'Permanently remove account' }}
                </p>
              </div>
              <Trash2 class="h-5 w-5 text-red-400" />
            </div>
          </button>
          
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
              {{ language === 'de' ? 'Datenschutz-Hinweis' : 'Privacy Notice' }}
            </h3>
            <p class="text-sm text-blue-600 dark:text-blue-300">
              {{ language === 'de' ? 'Ihre Daten werden gemäß DSGVO verarbeitet und geschützt.' : 'Your data is processed and protected according to GDPR.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  Palette, Bell, Shield, Settings, Database, Download, ChevronRight, Trash2, Save, RotateCcw
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)
const isDarkMode = computed(() => themeStore.isDarkMode)

const notificationSettings = ref([
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
  },
  {
    id: 4,
    title: language.value === 'de' ? 'Wöchentliche Zusammenfassung' : 'Weekly Summary',
    description: language.value === 'de' ? 'Wöchentlicher Bericht per E-Mail' : 'Weekly report via email',
    enabled: true
  }
])

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const handleLanguageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  themeStore.setLanguage(target.value as 'en' | 'de')
}

const saveSettings = () => {
  // Implementation of saveSettings
}

const resetSettings = () => {
  // Implementation of resetSettings
}
</script>
