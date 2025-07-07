<template>
  <div class="system-integration bg-gray-50 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'System-Integration' : 'System Integration' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Externe Systeme und API-Verbindungen verwalten' : 'Manage external systems and API connections' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showIntegrationModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Integration hinzufügen' : 'Add Integration' }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Integration Status Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="stat in integrationStats" :key="stat.title" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div :class="stat.iconBg" class="p-3 rounded-lg">
              <component :is="stat.icon" class="h-6 w-6 text-white" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
              <p :class="stat.changeColor" class="text-sm">{{ stat.change }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Integrations -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Aktive Integrationen' : 'Active Integrations' }}
          </h2>
          <div class="flex space-x-2">
            <button @click="syncAllIntegrations" class="btn-secondary text-sm">
              {{ language === 'de' ? 'Alle synchronisieren' : 'Sync All' }}
            </button>
            <button @click="testConnections" class="btn-secondary text-sm">
              {{ language === 'de' ? 'Verbindungen testen' : 'Test Connections' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="integration in activeIntegrations" :key="integration.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div :class="integration.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <component :is="integration.icon" class="h-5 w-5 text-slate-800" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">{{ integration.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ integration.type }}</p>
                </div>
              </div>
              <span :class="getStatusColor(integration.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ integration.status }}
              </span>
            </div>

            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Letzte Synchronisation' : 'Last Sync' }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ integration.lastSync }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Datensätze' : 'Records' }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ integration.recordCount }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Fehlerrate' : 'Error Rate' }}</span>
                <span :class="integration.errorRate > 5 ? 'text-red-600' : 'text-green-600'" class="font-medium">{{ integration.errorRate }}%</span>
              </div>
            </div>

            <div class="flex space-x-2">
              <button @click="configureIntegration(integration)" class="flex-1 px-3 py-2 text-sm bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200 transition-colors">
                {{ language === 'de' ? 'Konfigurieren' : 'Configure' }}
              </button>
              <button @click="syncIntegration(integration)" class="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                <RefreshCw class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Integration -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {{ language === 'de' ? 'Kalender-Integration' : 'Calendar Integration' }}
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Calendar Providers -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Kalender-Anbieter' : 'Calendar Providers' }}
            </h3>
            <div class="space-y-3">
              <div v-for="provider in calendarProviders" :key="provider.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <component :is="provider.icon" class="h-5 w-5 mr-3" :class="provider.iconColor" />
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ provider.name }}</h4>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="provider.enabled"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ provider.description }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-gray-500 dark:text-gray-500">{{ provider.syncedEvents }} {{ language === 'de' ? 'Termine synchronisiert' : 'events synced' }}</span>
                  <button @click="configureCalendar(provider)" class="text-xs text-primary-600 hover:text-primary-800">
                    {{ language === 'de' ? 'Konfigurieren' : 'Configure' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Sync Settings -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Synchronisationseinstellungen' : 'Sync Settings' }}
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Synchronisationsintervall' : 'Sync Interval' }}
                </label>
                <select v-model="syncInterval" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="5">{{ language === 'de' ? 'Alle 5 Minuten' : 'Every 5 minutes' }}</option>
                  <option value="15">{{ language === 'de' ? 'Alle 15 Minuten' : 'Every 15 minutes' }}</option>
                  <option value="30">{{ language === 'de' ? 'Alle 30 Minuten' : 'Every 30 minutes' }}</option>
                  <option value="60">{{ language === 'de' ? 'Stündlich' : 'Hourly' }}</option>
                </select>
              </div>

              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ language === 'de' ? 'Synchronisationsoptionen' : 'Sync Options' }}
                </label>
                <div class="space-y-2">
                  <label v-for="option in syncOptions" :key="option.id" class="flex items-center">
                    <input
                      v-model="option.enabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2"
                    />
                    <span class="text-sm text-gray-900 dark:text-white">{{ option.name }}</span>
                  </label>
                </div>
              </div>

              <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  {{ language === 'de' ? 'Nächste Synchronisation' : 'Next Sync' }}
                </h4>
                <p class="text-sm text-blue-600 dark:text-blue-300">{{ nextSyncTime }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LMS Integration -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {{ language === 'de' ? 'LMS-Integration' : 'LMS Integration' }}
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- LMS Platforms -->
          <div class="lg:col-span-2">
            <h3 class="font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'LMS-Plattformen' : 'LMS Platforms' }}
            </h3>
            <div class="space-y-4">
              <div v-for="lms in lmsPlatforms" :key="lms.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div :class="lms.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                      <component :is="lms.icon" class="h-5 w-5 text-slate-800" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">{{ lms.name }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ lms.description }}</p>
                    </div>
                  </div>
                  <span :class="getConnectionStatusColor(lms.connected)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ lms.connected ? (language === 'de' ? 'Verbunden' : 'Connected') : (language === 'de' ? 'Getrennt' : 'Disconnected') }}
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Kurse' : 'Courses' }}</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ lms.courses }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Schüler' : 'Students' }}</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ lms.students }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Letzte Sync' : 'Last Sync' }}</p>
                    <p class="font-medium text-gray-900 dark:text-white">{{ lms.lastSync }}</p>
                  </div>
                </div>

                <div class="flex space-x-2">
                  <button @click="connectLMS(lms)" :class="lms.connected ? 'btn-secondary' : 'btn-primary'" class="text-sm">
                    {{ lms.connected ? (language === 'de' ? 'Konfigurieren' : 'Configure') : (language === 'de' ? 'Verbinden' : 'Connect') }}
                  </button>
                  <button v-if="lms.connected" @click="syncLMS(lms)" class="btn-secondary text-sm">
                    {{ language === 'de' ? 'Synchronisieren' : 'Sync' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Data Mapping -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'Daten-Mapping' : 'Data Mapping' }}
            </h3>
            <div class="space-y-3">
              <div v-for="mapping in dataMappings" :key="mapping.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ mapping.source }}</h4>
                <div class="flex items-center my-2">
                  <ArrowRight class="h-4 w-4 text-gray-400 mx-2" />
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ mapping.target }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span :class="getMappingStatusColor(mapping.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ mapping.status }}
                  </span>
                  <button @click="editMapping(mapping)" class="text-xs text-primary-600 hover:text-primary-800">
                    {{ language === 'de' ? 'Bearbeiten' : 'Edit' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- API Management -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'API-Verwaltung' : 'API Management' }}
          </h2>
          <button @click="generateAPIKey" class="btn-primary text-sm">
            {{ language === 'de' ? 'API-Schlüssel generieren' : 'Generate API Key' }}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- API Endpoints -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'API-Endpunkte' : 'API Endpoints' }}
            </h3>
            <div class="space-y-3">
              <div v-for="endpoint in apiEndpoints" :key="endpoint.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ endpoint.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ endpoint.description }}</p>
                  </div>
                  <span :class="getMethodColor(endpoint.method)" class="px-2 py-1 text-xs font-medium rounded">
                    {{ endpoint.method }}
                  </span>
                </div>
                <code class="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">{{ endpoint.url }}</code>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-gray-500 dark:text-gray-500">{{ endpoint.calls }} {{ language === 'de' ? 'Aufrufe heute' : 'calls today' }}</span>
                  <button @click="testEndpoint(endpoint)" class="text-xs text-primary-600 hover:text-primary-800">
                    {{ language === 'de' ? 'Testen' : 'Test' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- API Keys -->
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-4">
              {{ language === 'de' ? 'API-Schlüssel' : 'API Keys' }}
            </h3>
            <div class="space-y-3">
              <div v-for="key in apiKeys" :key="key.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ key.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ key.description }}</p>
                  </div>
                  <span :class="getKeyStatusColor(key.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ key.status }}
                  </span>
                </div>
                <div class="flex items-center space-x-2 mb-2">
                  <code class="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded flex-1">{{ key.maskedKey }}</code>
                  <button @click="copyKey(key)" class="text-gray-400 hover:text-gray-600">
                    <Copy class="h-4 w-4" />
                  </button>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-500">{{ language === 'de' ? 'Läuft ab:' : 'Expires:' }} {{ key.expires }}</span>
                  <div class="flex space-x-2">
                    <button @click="regenerateKey(key)" class="text-xs text-yellow-600 hover:text-yellow-800">
                      {{ language === 'de' ? 'Erneuern' : 'Regenerate' }}
                    </button>
                    <button @click="revokeKey(key)" class="text-xs text-red-600 hover:text-red-800">
                      {{ language === 'de' ? 'Widerrufen' : 'Revoke' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Integration Modal -->
    <div v-if="showIntegrationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neue Integration hinzufügen' : 'Add New Integration' }}
            </h3>
            <button @click="showIntegrationModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          <!-- Integration form would go here -->
          <div class="flex justify-end space-x-3">
            <button @click="showIntegrationModal = false" class="btn-secondary">
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
            <button class="btn-primary">
              {{ language === 'de' ? 'Integration hinzufügen' : 'Add Integration' }}
            </button>
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
  Plus, RefreshCw, ArrowRight, Copy, X, Link, Database, 
  Calendar, BookOpen, Settings, Shield
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showIntegrationModal = ref(false)
const syncInterval = ref('15')
const nextSyncTime = ref('2024-03-12 14:30')

const integrationStats = ref([
  {
    title: language.value === 'de' ? 'Aktive Integrationen' : 'Active Integrations',
    value: '8',
    change: '+2 this month',
    changeColor: 'text-green-600',
    icon: Link,
    iconBg: 'bg-primary-600'
  },
  {
    title: language.value === 'de' ? 'API-Aufrufe' : 'API Calls',
    value: '12.4K',
    change: '+18% this week',
    changeColor: 'text-green-600',
    icon: Database,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Synchronisierte Datensätze' : 'Synced Records',
    value: '45.2K',
    change: '+1.2K today',
    changeColor: 'text-green-600',
    icon: RefreshCw,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Uptime' : 'Uptime',
    value: '99.8%',
    change: 'Last 30 days',
    changeColor: 'text-green-600',
    icon: Shield,
    iconBg: 'bg-purple-600'
  }
])

const activeIntegrations = ref([
  {
    id: 1,
    name: 'Google Calendar',
    type: 'Calendar',
    status: 'Connected',
    lastSync: '5 min ago',
    recordCount: '1,247',
    errorRate: 0.2,
    icon: Calendar,
    iconBg: 'bg-blue-600'
  },
  {
    id: 2,
    name: 'Moodle LMS',
    type: 'Learning Management',
    status: 'Connected',
    lastSync: '15 min ago',
    recordCount: '3,456',
    errorRate: 1.8,
    icon: BookOpen,
    iconBg: 'bg-green-600'
  },
  {
    id: 3,
    name: 'Microsoft Teams',
    type: 'Communication',
    status: 'Syncing',
    lastSync: '2 min ago',
    recordCount: '892',
    errorRate: 0.5,
    icon: Settings,
    iconBg: 'bg-purple-600'
  },
  {
    id: 4,
    name: 'Student Information System',
    type: 'Database',
    status: 'Error',
    lastSync: '2 hours ago',
    recordCount: '8,234',
    errorRate: 12.3,
    icon: Database,
    iconBg: 'bg-red-600'
  }
])

const calendarProviders = ref([
  {
    id: 1,
    name: 'Google Calendar',
    description: 'Sync with Google Calendar for events and scheduling',
    enabled: true,
    syncedEvents: 156,
    icon: Calendar,
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    name: 'Microsoft Outlook',
    description: 'Integration with Outlook calendar system',
    enabled: false,
    syncedEvents: 0,
    icon: Calendar,
    iconColor: 'text-blue-800'
  },
  {
    id: 3,
    name: 'Apple Calendar',
    description: 'Sync with iCloud calendar services',
    enabled: false,
    syncedEvents: 0,
    icon: Calendar,
    iconColor: 'text-gray-600'
  }
])

const syncOptions = ref([
  { id: 1, name: language.value === 'de' ? 'Bidirektionale Synchronisation' : 'Bidirectional sync', enabled: true },
  { id: 2, name: language.value === 'de' ? 'Automatische Konfliktlösung' : 'Automatic conflict resolution', enabled: false },
  { id: 3, name: language.value === 'de' ? 'Benachrichtigungen bei Fehlern' : 'Error notifications', enabled: true },
  { id: 4, name: language.value === 'de' ? 'Detaillierte Protokollierung' : 'Detailed logging', enabled: false }
])

const lmsPlatforms = ref([
  {
    id: 1,
    name: 'Moodle',
    description: 'Open-source learning management system',
    connected: true,
    courses: 45,
    students: 1247,
    lastSync: '10 min ago',
    icon: BookOpen,
    iconBg: 'bg-green-600'
  },
  {
    id: 2,
    name: 'Canvas',
    description: 'Cloud-based learning management platform',
    connected: false,
    courses: 0,
    students: 0,
    lastSync: 'Never',
    icon: BookOpen,
    iconBg: 'bg-blue-600'
  },
  {
    id: 3,
    name: 'Blackboard',
    description: 'Educational technology and services',
    connected: false,
    courses: 0,
    students: 0,
    lastSync: 'Never',
    icon: BookOpen,
    iconBg: 'bg-purple-600'
  }
])

const dataMappings = ref([
  {
    id: 1,
    source: 'LMS Student Records',
    target: 'WinSchool Student Database',
    status: 'Active'
  },
  {
    id: 2,
    source: 'Calendar Events',
    target: 'School Timetable',
    status: 'Active'
  },
  {
    id: 3,
    source: 'Grade Data',
    target: 'Academic Records',
    status: 'Pending'
  }
])

const apiEndpoints = ref([
  {
    id: 1,
    name: 'Student Data',
    description: 'Retrieve student information',
    method: 'GET',
    url: '/api/v1/students',
    calls: 1247
  },
  {
    id: 2,
    name: 'Create Enrollment',
    description: 'Add new student enrollment',
    method: 'POST',
    url: '/api/v1/enrollments',
    calls: 89
  },
  {
    id: 3,
    name: 'Update Grades',
    description: 'Modify student grades',
    method: 'PUT',
    url: '/api/v1/grades',
    calls: 456
  }
])

const apiKeys = ref([
  {
    id: 1,
    name: 'Production API Key',
    description: 'Main API key for production environment',
    maskedKey: 'ws_live_••••••••••••••••••••••••••••••••',
    status: 'Active',
    expires: '2024-12-31'
  },
  {
    id: 2,
    name: 'Development API Key',
    description: 'API key for development and testing',
    maskedKey: 'ws_test_••••••••••••••••••••••••••••••••',
    status: 'Active',
    expires: '2024-06-30'
  },
  {
    id: 3,
    name: 'Legacy API Key',
    description: 'Deprecated API key for old integrations',
    maskedKey: 'ws_old_••••••••••••••••••••••••••••••••',
    status: 'Deprecated',
    expires: '2024-03-31'
  }
])

const syncAllIntegrations = () => {
  alert(language.value === 'de' ? 'Alle Integrationen werden synchronisiert...' : 'Syncing all integrations...')
}

const testConnections = () => {
  alert(language.value === 'de' ? 'Verbindungen werden getestet...' : 'Testing connections...')
}

const configureIntegration = (integration: any) => {
  alert(`${language.value === 'de' ? 'Integration konfigurieren' : 'Configure integration'}: ${integration.name}`)
}

const syncIntegration = (integration: any) => {
  alert(`${language.value === 'de' ? 'Synchronisiere' : 'Syncing'} ${integration.name}`)
}

const configureCalendar = (provider: any) => {
  alert(`${language.value === 'de' ? 'Kalender konfigurieren' : 'Configure calendar'}: ${provider.name}`)
}

const connectLMS = (lms: any) => {
  alert(`${language.value === 'de' ? 'LMS verbinden' : 'Connect LMS'}: ${lms.name}`)
}

const syncLMS = (lms: any) => {
  alert(`${language.value === 'de' ? 'LMS synchronisieren' : 'Sync LMS'}: ${lms.name}`)
}

const editMapping = (mapping: any) => {
  alert(`${language.value === 'de' ? 'Mapping bearbeiten' : 'Edit mapping'}: ${mapping.source}`)
}

const generateAPIKey = () => {
  alert(language.value === 'de' ? 'Neuer API-Schlüssel wird generiert...' : 'Generating new API key...')
}

const testEndpoint = (endpoint: any) => {
  alert(`${language.value === 'de' ? 'Endpunkt testen' : 'Test endpoint'}: ${endpoint.name}`)
}

const copyKey = (key: any) => {
  alert(`${language.value === 'de' ? 'API-Schlüssel kopiert' : 'API key copied'}: ${key.name}`)
}

const regenerateKey = (key: any) => {
  alert(`${language.value === 'de' ? 'Schlüssel erneuern' : 'Regenerate key'}: ${key.name}`)
}

const revokeKey = (key: any) => {
  alert(`${language.value === 'de' ? 'Schlüssel widerrufen' : 'Revoke key'}: ${key.name}`)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Connected':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Syncing':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Disconnected':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getConnectionStatusColor = (connected: boolean) => {
  return connected 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const getMappingStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-green-100 text-green-800'
    case 'POST':
      return 'bg-blue-100 text-blue-800'
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800'
    case 'DELETE':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getKeyStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Deprecated':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Revoked':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
