<template>
  <div class="updates bg-gray-50 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'System-Updates' : 'System Updates' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie System-Updates und Versionen' : 'Manage system updates and versions' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="checkForUpdates" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <RefreshCw class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Nach Updates suchen' : 'Check for Updates' }}
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Current Version Info -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Aktuelle Version' : 'Current Version' }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Version' : 'Version' }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">v3.5.2</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ language === 'de' ? 'Installiert am' : 'Installed on' }}: 2024-03-01</p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Build' : 'Build' }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">#12458</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ language === 'de' ? 'Stabil' : 'Stable' }}</p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Status' : 'Status' }}</p>
            <p class="text-xl font-bold text-green-600">{{ language === 'de' ? 'Aktuell' : 'Up to date' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ language === 'de' ? 'Letzte Prüfung' : 'Last checked' }}: {{ lastChecked }}</p>
          </div>
        </div>
      </div>

      <!-- Available Updates -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Verfügbare Updates' : 'Available Updates' }}
        </h2>
        <div class="space-y-4">
          <div v-for="update in availableUpdates" :key="update.id" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">{{ update.name }} ({{ update.version }})</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ update.description }}</p>
              </div>
              <span :class="getUpdateTypeColor(update.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ update.type }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Veröffentlicht' : 'Released' }}</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ update.releaseDate }}</p>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Größe' : 'Size' }}</p>
                <p class="font-medium text-gray-900 dark:text-white">{{ update.size }}</p>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Status' : 'Status' }}</p>
                <span :class="getUpdateStatusColor(update.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ update.status }}
                </span>
              </div>
            </div>
            
            <div class="space-y-2 mb-4">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ language === 'de' ? 'Änderungen' : 'Changes' }}:</p>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1 pl-5 list-disc">
                <li v-for="(change, index) in update.changes" :key="index">{{ change }}</li>
              </ul>
            </div>
            
            <div class="flex justify-end space-x-2">
              <button @click="viewReleaseNotes(update)" class="btn-secondary text-sm">
                {{ language === 'de' ? 'Release Notes' : 'Release Notes' }}
              </button>
              <button 
                @click="installUpdate(update)" 
                :disabled="update.status === 'Installing' || update.status === 'Installed'"
                :class="update.status === 'Installing' || update.status === 'Installed' ? 'opacity-50 cursor-not-allowed' : ''"
                class="btn-primary text-sm"
              >
                <span v-if="update.status === 'Available'">{{ language === 'de' ? 'Installieren' : 'Install' }}</span>
                <span v-else-if="update.status === 'Installing'">{{ language === 'de' ? 'Installiere...' : 'Installing...' }}</span>
                <span v-else>{{ language === 'de' ? 'Installiert' : 'Installed' }}</span>
              </button>
            </div>
          </div>
          
          <div v-if="availableUpdates.length === 0" class="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <CheckCircle class="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ language === 'de' ? 'System ist aktuell' : 'System is up to date' }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
              {{ language === 'de' ? 'Es sind derzeit keine Updates verfügbar.' : 'There are currently no updates available.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Update History -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Update-Verlauf' : 'Update History' }}
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Version' : 'Version' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Installiert am' : 'Installed On' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Installiert von' : 'Installed By' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Typ' : 'Type' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Status' : 'Status' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="update in updateHistory" :key="update.id" class="border-b border-gray-100 dark:border-gray-700">
                <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ update.version }}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ update.installedOn }}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ update.installedBy }}</td>
                <td class="py-3 px-4">
                  <span :class="getUpdateTypeColor(update.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ update.type }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span :class="getUpdateHistoryStatusColor(update.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ update.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewReleaseNotes(update)" class="text-primary-600 hover:text-primary-800">
                      <FileText class="h-4 w-4" />
                    </button>
                    <button v-if="update.status === 'Failed'" @click="retryUpdate(update)" class="text-yellow-600 hover:text-yellow-800">
                      <RefreshCw class="h-4 w-4" />
                    </button>
                    <button v-if="update.status === 'Successful'" @click="rollbackUpdate(update)" class="text-red-600 hover:text-red-800">
                      <RotateCcw class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  RefreshCw, CheckCircle, FileText, RotateCcw
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const lastChecked = ref(new Date().toLocaleString())

const availableUpdates = ref([
  {
    id: 1,
    name: 'Security Patch',
    version: 'v3.5.3',
    description: 'Critical security updates for authentication system',
    type: 'Security',
    releaseDate: '2024-03-12',
    size: '15 MB',
    status: 'Available',
    changes: [
      'Fixed authentication vulnerability in login system',
      'Updated password hashing algorithm',
      'Improved session security'
    ]
  },
  {
    id: 2,
    name: 'Feature Update',
    version: 'v3.6.0',
    description: 'New reporting features and UI improvements',
    type: 'Feature',
    releaseDate: '2024-03-10',
    size: '45 MB',
    status: 'Available',
    changes: [
      'Added new dashboard widgets',
      'Improved reporting engine with export options',
      'Enhanced user interface for mobile devices',
      'Added 5 new report templates'
    ]
  }
])

const updateHistory = ref([
  {
    id: 1,
    version: 'v3.5.2',
    installedOn: '2024-03-01',
    installedBy: 'Admin Master',
    type: 'Maintenance',
    status: 'Successful'
  },
  {
    id: 2,
    version: 'v3.5.1',
    installedOn: '2024-02-15',
    installedBy: 'Admin Master',
    type: 'Security',
    status: 'Successful'
  },
  {
    id: 3,
    version: 'v3.5.0',
    installedOn: '2024-02-01',
    installedBy: 'System',
    type: 'Feature',
    status: 'Successful'
  },
  {
    id: 4,
    version: 'v3.4.5',
    installedOn: '2024-01-20',
    installedBy: 'Admin Master',
    type: 'Hotfix',
    status: 'Failed'
  },
  {
    id: 5,
    version: 'v3.4.4',
    installedOn: '2024-01-15',
    installedBy: 'System',
    type: 'Security',
    status: 'Successful'
  }
])

const getUpdateTypeColor = (type: string) => {
  switch (type) {
    case 'Security':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Feature':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Maintenance':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Hotfix':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getUpdateStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Installing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Installed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getUpdateHistoryStatusColor = (status: string) => {
  switch (status) {
    case 'Successful':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Rollback':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const checkForUpdates = () => {
  lastChecked.value = new Date().toLocaleString()
  alert(language.value === 'de' ? 'Nach Updates wird gesucht...' : 'Checking for updates...')
}

const viewReleaseNotes = (update: any) => {
  alert(`${language.value === 'de' ? 'Release Notes für' : 'Release notes for'} ${update.version || update.name}`)
}

const installUpdate = (update: any) => {
  if (update.status === 'Available') {
    update.status = 'Installing'
    setTimeout(() => {
      update.status = 'Installed'
      
      // Add to update history
      updateHistory.value.unshift({
        id: updateHistory.value.length + 1,
        version: update.version,
        installedOn: new Date().toISOString().split('T')[0],
        installedBy: 'Admin Master',
        type: update.type,
        status: 'Successful'
      })
      
      alert(`${language.value === 'de' ? 'Update erfolgreich installiert' : 'Update successfully installed'}: ${update.name}`)
    }, 2000)
  }
}

const retryUpdate = (update: any) => {
  alert(`${language.value === 'de' ? 'Update erneut versuchen' : 'Retry update'}: ${update.version}`)
}

const rollbackUpdate = (update: any) => {
  alert(`${language.value === 'de' ? 'Update zurücksetzen' : 'Rollback update'}: ${update.version}`)
}
</script>
