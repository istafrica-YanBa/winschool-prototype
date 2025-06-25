<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Key Metrics -->
    <div class="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="metric in keyMetrics" :key="metric.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div :class="metric.iconBg" class="p-3 rounded-lg">
            <component :is="metric.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ metric.title }}</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-slate-50">{{ metric.value }}</p>
            <p :class="metric.changeColor" class="text-sm">{{ metric.change }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Activity class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'System-Status' : 'System Status' }}
      </h2>
      <div class="space-y-4">
        <div v-for="status in systemStatus" :key="status.id" class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex items-center">
            <component :is="status.icon" class="h-5 w-5 mr-3" :class="getStatusIconColor(status.status)" />
            <div>
              <p class="font-medium text-slate-800 dark:text-slate-50">{{ status.name }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ status.lastChecked }}</p>
            </div>
          </div>
          <span :class="getStatusColor(status.status)" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ status.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Recent Schools -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Building class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Neueste Schulen' : 'Recent Schools' }}
      </h2>
      <div class="space-y-3">
        <div v-for="school in recentSchools" :key="school.id" class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-br from-indigo-700 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Building class="h-5 w-5 text-white" />
            </div>
            <div>
              <p class="font-medium text-slate-800 dark:text-slate-50">{{ school.name }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ school.location }}</p>
            </div>
          </div>
          <span :class="getSchoolStatusColor(school.status)" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ school.status }}
          </span>
        </div>
      </div>
      <div class="mt-4">
        <router-link to="/dashboard/schools" class="text-blue-600 hover:text-indigo-700 text-sm font-medium flex items-center transition-colors">
          <span>{{ language === 'de' ? 'Alle Schulen anzeigen' : 'View all schools' }}</span>
          <ChevronRight class="h-4 w-4 ml-1" />
        </router-link>
      </div>
    </div>

    <!-- System Configuration -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Settings class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'System-Konfiguration' : 'System Configuration' }}
      </h2>
      <div class="space-y-4">
        <div v-for="config in systemConfig" :key="config.id" class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ config.name }}</h3>
            <button @click="editConfig(config)" class="text-blue-600 hover:text-indigo-700 transition-colors">
              <Edit class="h-4 w-4" />
            </button>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ config.description }}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Letzte Änderung:' : 'Last modified:' }} {{ config.lastModified }}</span>
            <span :class="config.enabled ? 'text-green-500' : 'text-red-500'" class="text-xs font-medium">
              {{ config.enabled ? (language === 'de' ? 'Aktiviert' : 'Enabled') : (language === 'de' ? 'Deaktiviert' : 'Disabled') }}
            </span>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <router-link to="/dashboard/system-config" class="text-blue-600 hover:text-indigo-700 text-sm font-medium flex items-center transition-colors">
          <span>{{ language === 'de' ? 'Alle Konfigurationen anzeigen' : 'View all configurations' }}</span>
          <ChevronRight class="h-4 w-4 ml-1" />
        </router-link>
      </div>
    </div>

    <!-- Support Tickets -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <LifeBuoy class="h-5 w-5 mr-2 text-red-500" />
        {{ language === 'de' ? 'Support-Tickets' : 'Support Tickets' }}
      </h2>
      <div class="space-y-3">
        <div v-for="ticket in supportTickets" :key="ticket.id" class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ ticket.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ ticket.school }}</p>
            </div>
            <span :class="getTicketPriorityColor(ticket.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ ticket.priority }}
            </span>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ ticket.date }}</span>
            <button @click="viewTicket(ticket)" class="text-blue-600 hover:text-indigo-700 text-sm transition-colors">
              {{ language === 'de' ? 'Anzeigen' : 'View' }}
            </button>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <router-link to="/dashboard/support" class="text-blue-600 hover:text-indigo-700 text-sm font-medium flex items-center transition-colors">
          <span>{{ language === 'de' ? 'Alle Tickets anzeigen' : 'View all tickets' }}</span>
          <ChevronRight class="h-4 w-4 ml-1" />
        </router-link>
      </div>
    </div>

    <!-- System Updates -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <RefreshCw class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'System-Updates' : 'System Updates' }}
      </h2>
      <div class="space-y-3">
        <div v-for="update in systemUpdates" :key="update.id" class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ update.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ update.description }}</p>
            </div>
            <span :class="getUpdateStatusColor(update.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ update.status }}
            </span>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ update.releaseDate }}</span>
            <button @click="installUpdate(update)" :disabled="update.status === 'Installed'" 
                    :class="update.status === 'Installed' ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:text-indigo-700 transition-colors'" 
                    class="text-sm">
              {{ update.status === 'Installed' ? (language === 'de' ? 'Installiert' : 'Installed') : (language === 'de' ? 'Installieren' : 'Install') }}
            </button>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <router-link to="/dashboard/updates" class="text-blue-600 hover:text-indigo-700 text-sm font-medium flex items-center transition-colors">
          <span>{{ language === 'de' ? 'Alle Updates anzeigen' : 'View all updates' }}</span>
          <ChevronRight class="h-4 w-4 ml-1" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { 
  Building, Activity, Settings, LifeBuoy, RefreshCw, ChevronRight, Edit,
  Users, Database, Server, Globe, CheckCircle, AlertTriangle, Clock
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const keyMetrics = [
  {
    title: language.value === 'de' ? 'Aktive Schulen' : 'Active Schools',
    value: '42',
    change: '+3 this month',
    changeColor: 'text-green-500',
    icon: Building,
    iconBg: 'bg-gradient-to-br from-indigo-700 to-blue-600'
  },
  {
    title: language.value === 'de' ? 'Gesamte Benutzer' : 'Total Users',
    value: '12,847',
    change: '+156 this week',
    changeColor: 'text-green-500',
    icon: Users,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Systemauslastung' : 'System Load',
    value: '24%',
    change: '-2% from yesterday',
    changeColor: 'text-green-500',
    icon: Server,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Datenbankgröße' : 'Database Size',
    value: '1.2 TB',
    change: '+45 GB this month',
    changeColor: 'text-yellow-500',
    icon: Database,
    iconBg: 'bg-slate-600'
  }
]

const systemStatus = [
  {
    id: 1,
    name: 'Application Server',
    status: 'Operational',
    lastChecked: '5 minutes ago',
    icon: Server
  },
  {
    id: 2,
    name: 'Database Server',
    status: 'Operational',
    lastChecked: '5 minutes ago',
    icon: Database
  },
  {
    id: 3,
    name: 'Storage System',
    status: 'Operational',
    lastChecked: '5 minutes ago',
    icon: Database
  },
  {
    id: 4,
    name: 'API Services',
    status: 'Degraded',
    lastChecked: '5 minutes ago',
    icon: Globe
  }
]

const recentSchools = [
  {
    id: 1,
    name: 'Gymnasium Berlin-Mitte',
    location: 'Berlin, Germany',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Realschule Hamburg-Nord',
    location: 'Hamburg, Germany',
    status: 'Setup'
  },
  {
    id: 3,
    name: 'Gesamtschule München-Süd',
    location: 'Munich, Germany',
    status: 'Active'
  }
]

const systemConfig = [
  {
    id: 1,
    name: 'Global Security Settings',
    description: 'Password policies, session timeouts, and authentication methods',
    lastModified: '2024-03-10',
    enabled: true
  },
  {
    id: 2,
    name: 'Email Configuration',
    description: 'SMTP settings for system notifications and alerts',
    lastModified: '2024-03-05',
    enabled: true
  },
  {
    id: 3,
    name: 'Data Retention Policy',
    description: 'Automated data archiving and deletion rules',
    lastModified: '2024-02-28',
    enabled: false
  }
]

const supportTickets = [
  {
    id: 1,
    title: 'Login Issues for Teachers',
    school: 'Gymnasium Berlin-Mitte',
    priority: 'High',
    date: '2024-03-12'
  },
  {
    id: 2,
    title: 'Grade Import Failure',
    school: 'Realschule Hamburg-Nord',
    priority: 'Medium',
    date: '2024-03-11'
  },
  {
    id: 3,
    title: 'Report Generation Error',
    school: 'Gesamtschule München-Süd',
    priority: 'Low',
    date: '2024-03-10'
  }
]

const systemUpdates = [
  {
    id: 1,
    name: 'Security Patch 2.4.1',
    description: 'Critical security updates for authentication system',
    status: 'Available',
    releaseDate: '2024-03-12'
  },
  {
    id: 2,
    name: 'Feature Update 3.2.0',
    description: 'New reporting features and UI improvements',
    status: 'Available',
    releaseDate: '2024-03-10'
  },
  {
    id: 3,
    name: 'Maintenance Update 2.3.5',
    description: 'Performance optimizations and bug fixes',
    status: 'Installed',
    releaseDate: '2024-03-01'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Operational':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Degraded':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'Outage':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getStatusIconColor = (status: string) => {
  switch (status) {
    case 'Operational':
      return 'text-green-500'
    case 'Degraded':
      return 'text-yellow-500'
    case 'Outage':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

const getSchoolStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Setup':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getTicketPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'Low':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getUpdateStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Installing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'Installed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const editConfig = (config: any) => {
  alert(`${language.value === 'de' ? 'Konfiguration bearbeiten' : 'Edit configuration'}: ${config.name}`)
}

const viewTicket = (ticket: any) => {
  alert(`${language.value === 'de' ? 'Ticket anzeigen' : 'View ticket'}: ${ticket.title}`)
}

const installUpdate = (update: any) => {
  if (update.status !== 'Installed') {
    alert(`${language.value === 'de' ? 'Update installieren' : 'Install update'}: ${update.name}`)
  }
}
</script>