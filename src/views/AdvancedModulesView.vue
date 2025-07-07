<template>
  <div class="advanced-modules bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Breadcrumb Navigation -->
    <RuneBreadcrumbs
      truncate
      max-width=""
      :items="breadcrumbItems"
    />
    
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Settings class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Erweiterte Module' : 'Advanced Modules' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie erweiterte Systemmodule und Funktionen' : 'Manage advanced system modules and features' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <router-link to="/dashboard/support" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <LifeBuoy class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Support' : 'Support' }}
        </router-link>
        <button @click="enableModule" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Modul aktivieren' : 'Enable Module' }}
        </button>
      </div>
    </div>

    <!-- Module Overview Statistics -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in moduleStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center">
          <div :class="stat.iconBg" class="p-2 sm:p-3 rounded-lg mb-2 sm:mb-0 sm:mr-4 self-start sm:self-auto">
            <component :is="stat.icon" class="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{{ stat.title }}</p>
            <p class="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-50">{{ stat.value }}</p>
            <p :class="stat.changeColor" class="text-xs sm:text-sm truncate">{{ stat.change }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Module Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div v-for="category in moduleCategories" :key="category.id" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center mb-4">
          <div :class="category.iconBg" class="p-3 rounded-lg">
            <component :is="category.icon" class="h-6 w-6 text-white" />
          </div>
          <h2 class="ml-4 text-lg font-semibold text-slate-800 dark:text-slate-50">{{ category.title }}</h2>
        </div>
        <p class="text-slate-600 dark:text-slate-400 mb-4">{{ category.description }}</p>
        <div class="space-y-2">
          <div v-for="module in category.modules" :key="module.id" class="flex items-center text-sm">
            <component :is="module.enabled ? CheckCircle : Circle" :class="module.enabled ? 'text-green-600' : 'text-slate-400'" class="h-4 w-4 mr-2" />
            <span :class="module.enabled ? 'text-slate-800 dark:text-slate-50' : 'text-slate-500 dark:text-slate-400'">{{ module.name }}</span>
          </div>
        </div>
        <button @click="configureCategory(category)" class="w-full mt-4 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-2 rounded-lg transition-colors text-sm">
          {{ language === 'de' ? 'Konfigurieren' : 'Configure' }}
        </button>
      </div>
    </div>

    <!-- Available Modules -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
          {{ language === 'de' ? 'Verfügbare Module' : 'Available Modules' }}
        </h2>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <select v-model="filterCategory" class="w-full sm:w-auto px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50 text-sm">
            <option value="">{{ language === 'de' ? 'Alle Kategorien' : 'All Categories' }}</option>
            <option value="academic">{{ language === 'de' ? 'Akademisch' : 'Academic' }}</option>
            <option value="administrative">{{ language === 'de' ? 'Administrativ' : 'Administrative' }}</option>
            <option value="reporting">{{ language === 'de' ? 'Berichte' : 'Reporting' }}</option>
          </select>
          <select v-model="filterStatus" class="w-full sm:w-auto px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-50 text-sm">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="enabled">{{ language === 'de' ? 'Aktiviert' : 'Enabled' }}</option>
            <option value="disabled">{{ language === 'de' ? 'Deaktiviert' : 'Disabled' }}</option>
            <option value="beta">{{ language === 'de' ? 'Beta' : 'Beta' }}</option>
          </select>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                {{ language === 'de' ? 'Modul' : 'Module' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                {{ language === 'de' ? 'Kategorie' : 'Category' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                {{ language === 'de' ? 'Version' : 'Version' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-slate-500 dark:text-slate-400">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="module in filteredModules" :key="module.id" class="border-b border-slate-100 dark:border-slate-700">
              <td class="py-3 px-4">
                <div>
                  <p class="font-medium text-slate-800 dark:text-slate-50">{{ module.name }}</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{{ module.description }}</p>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-800 dark:text-slate-50">{{ module.category }}</td>
              <td class="py-3 px-4">
                <span :class="getStatusColor(module.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ module.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-500 dark:text-slate-400">{{ module.version }}</td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="toggleModule(module)" :class="module.enabled ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'" class="transition-colors">
                    <component :is="module.enabled ? X : Play" class="h-4 w-4" />
                  </button>
                  <button @click="configureModule(module)" class="text-blue-600 hover:text-blue-700 transition-colors">
                    <Settings class="h-4 w-4" />
                  </button>
                  <button @click="viewModuleInfo(module)" class="text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors">
                    <Eye class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden space-y-3">
        <div v-for="module in filteredModules" :key="module.id" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-3">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-slate-800 dark:text-slate-50 truncate">{{ module.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ module.description }}</p>
            </div>
            <span :class="getStatusColor(module.status)" class="px-2 py-1 text-xs font-medium rounded-full ml-2 flex-shrink-0">
              {{ module.status }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ language === 'de' ? 'Kategorie' : 'Category' }}</p>
              <p class="text-sm text-slate-800 dark:text-slate-50">{{ module.category }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-slate-600 dark:text-slate-300">{{ language === 'de' ? 'Version' : 'Version' }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ module.version }}</p>
            </div>
          </div>

          <div class="flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-600 pt-3">
            <button @click="toggleModule(module)" :class="[
              'flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
              module.enabled 
                ? 'bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/40' 
                : 'bg-green-100 dark:bg-green-900/20 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/40'
            ]">
              <component :is="module.enabled ? X : Play" class="h-4 w-4" />
            </button>
            <button @click="configureModule(module)" class="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
              <Settings class="h-4 w-4" />
            </button>
            <button @click="viewModuleInfo(module)" class="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors">
              <Eye class="h-4 w-4" />
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
import { RuneBreadcrumbs } from '@ist/commonui-components'
import { 
  Settings, Plus, LifeBuoy, CheckCircle, Circle, Eye, X, Play,
  Shield, BookOpen, BarChart3,
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Breadcrumb items for RuneBreadcrumbs
const breadcrumbItems = [
  { label: 'Home', href: '/dashboard' },
  { label: 'Advanced System', href: '/dashboard' },
  { label: 'Advanced Modules', href: '' }
]

const filterCategory = ref('')
const filterStatus = ref('')

const moduleStats = [
  {
    title: language.value === 'de' ? 'Aktivierte Module' : 'Enabled Modules',
    value: '12',
    change: '+2 this month',
    changeColor: 'text-green-500',
    icon: CheckCircle,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Verfügbare Module' : 'Available Modules',
    value: '28',
    change: '+5 new modules',
    changeColor: 'text-blue-500',
    icon: BookOpen,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Beta Module' : 'Beta Modules',
    value: '4',
    change: '2 ready for production',
    changeColor: 'text-yellow-500',
    icon: Settings,
    iconBg: 'bg-yellow-600'
  },
  {
    title: language.value === 'de' ? 'Systemauslastung' : 'System Load',
    value: '68%',
    change: 'Optimized performance',
    changeColor: 'text-green-500',
    icon: BarChart3,
    iconBg: 'bg-purple-600'
  }
]

const moduleCategories = [
  {
    id: 1,
    title: language.value === 'de' ? 'Akademische Module' : 'Academic Modules',
    description: language.value === 'de' ? 'Lernanalysen und Bewertungstools' : 'Learning analytics and assessment tools',
    icon: BookOpen,
    iconBg: 'bg-blue-600',
    modules: [
      { id: 101, name: language.value === 'de' ? 'Erweiterte Analytics' : 'Advanced Analytics', enabled: true },
      { id: 102, name: language.value === 'de' ? 'KI-Bewertung' : 'AI Assessment', enabled: true },
      { id: 103, name: language.value === 'de' ? 'Lernpfade' : 'Learning Paths', enabled: false }
    ]
  },
  {
    id: 2,
    title: language.value === 'de' ? 'Administrative Module' : 'Administrative Modules',
    description: language.value === 'de' ? 'Verwaltung und Compliance-Tools' : 'Management and compliance tools',
    icon: Shield,
    iconBg: 'bg-green-600',
    modules: [
      { id: 201, name: language.value === 'de' ? 'DSGVO-Compliance' : 'GDPR Compliance', enabled: true },
      { id: 202, name: language.value === 'de' ? 'Audit-Trail' : 'Audit Trail', enabled: true },
      { id: 203, name: language.value === 'de' ? 'Backup-Manager' : 'Backup Manager', enabled: false }
    ]
  },
  {
    id: 3,
    title: language.value === 'de' ? 'Berichtsmodule' : 'Reporting Modules',
    description: language.value === 'de' ? 'Erweiterte Berichte und Visualisierungen' : 'Advanced reports and visualizations',
    icon: BarChart3,
    iconBg: 'bg-purple-600',
    modules: [
      { id: 301, name: language.value === 'de' ? 'Dashboard-Builder' : 'Dashboard Builder', enabled: true },
      { id: 302, name: language.value === 'de' ? 'Exporttools' : 'Export Tools', enabled: true },
      { id: 303, name: language.value === 'de' ? 'Echtzeitdaten' : 'Real-time Data', enabled: false }
    ]
  }
]

const availableModules = [
  {
    id: 1,
    name: language.value === 'de' ? 'Erweiterte Lernanalysen' : 'Advanced Learning Analytics',
    description: language.value === 'de' ? 'KI-gestützte Lernanalytik' : 'AI-powered learning analytics',
    category: 'Academic',
    status: 'Enabled',
    version: '2.1.0',
    enabled: true
  },
  {
    id: 2,
    name: language.value === 'de' ? 'DSGVO-Compliance-Suite' : 'GDPR Compliance Suite',
    description: language.value === 'de' ? 'Vollständige DSGVO-Compliance' : 'Complete GDPR compliance tools',
    category: 'Administrative',
    status: 'Enabled',
    version: '1.8.2',
    enabled: true
  },
  {
    id: 3,
    name: language.value === 'de' ? 'Interaktive Dashboards' : 'Interactive Dashboards',
    description: language.value === 'de' ? 'Anpassbare Dashboard-Erstellung' : 'Customizable dashboard creation',
    category: 'Reporting',
    status: 'Enabled',
    version: '3.0.1',
    enabled: true
  },
  {
    id: 4,
    name: language.value === 'de' ? 'KI-Bewertungsassistent' : 'AI Assessment Assistant',
    description: language.value === 'de' ? 'Automatisierte Bewertungshilfe' : 'Automated assessment assistance',
    category: 'Academic',
    status: 'Beta',
    version: '0.9.5',
    enabled: false
  },
  {
    id: 5,
    name: language.value === 'de' ? 'Erweiterte Backup-Lösung' : 'Advanced Backup Solution',
    description: language.value === 'de' ? 'Automatische Datensicherung' : 'Automated data backup',
    category: 'Administrative',
    status: 'Disabled',
    version: '1.2.0',
    enabled: false
  }
]

const filteredModules = computed(() => {
  let filtered = availableModules

  if (filterCategory.value) {
    filtered = filtered.filter(module => module.category.toLowerCase() === filterCategory.value)
  }

  if (filterStatus.value) {
    if (filterStatus.value === 'enabled') {
      filtered = filtered.filter(module => module.enabled)
    } else if (filterStatus.value === 'disabled') {
      filtered = filtered.filter(module => !module.enabled)
    } else {
      filtered = filtered.filter(module => module.status.toLowerCase() === filterStatus.value)
    }
  }

  return filtered
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Enabled':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Disabled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'Beta':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400'
  }
}

const enableModule = () => {
  console.log('Enable module dialog')
}

const configureCategory = (category: any) => {
  console.log('Configure category:', category.title)
}

const toggleModule = (module: any) => {
  module.enabled = !module.enabled
  module.status = module.enabled ? 'Enabled' : 'Disabled'
}

const configureModule = (module: any) => {
  console.log('Configure module:', module.name)
}

const viewModuleInfo = (module: any) => {
  console.log('View module info:', module.name)
}
</script> 