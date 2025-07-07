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
            <p :class="metric.changeColor" class="text-xs flex items-center">
              <TrendingUp class="h-3 w-3 mr-1" />
              {{ metric.change }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Enrollments -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <UserPlus class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Jüngste Anmeldungen' : 'Recent Enrollments' }}
      </h2>
      <div class="space-y-3">
        <div 
          v-for="enrollment in recentEnrollments" 
          :key="enrollment.id"
          class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div class="flex items-center space-x-3">
            <img :src="enrollment.avatar" :alt="enrollment.name" class="h-8 w-8 rounded-full">
            <div>
              <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ enrollment.name }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ enrollment.class }} • {{ enrollment.date }}</p>
            </div>
          </div>
          <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(enrollment.status)">
            {{ enrollment.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Financial Overview -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <DollarSign class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Finanzübersicht' : 'Financial Overview' }}
      </h2>
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div class="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
          <DollarSign class="h-6 w-6 text-green-500 dark:text-green-400 mx-auto mb-1" />
          <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Monatliche Einnahmen' : 'Monthly Revenue' }}</span>
          <p class="text-lg font-bold text-green-500 dark:text-green-400">€45,260</p>
        </div>
        <div class="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
          <Clock class="h-6 w-6 text-yellow-500 dark:text-yellow-400 mx-auto mb-1" />
          <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Ausstehende Zahlungen' : 'Outstanding Payments' }}</span>
          <p class="text-lg font-bold text-yellow-500 dark:text-yellow-400">€8,450</p>
        </div>
        <div class="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <Award class="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
          <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Finanzielle Hilfe' : 'Financial Aid' }}</span>
          <p class="text-lg font-bold text-blue-600 dark:text-blue-400">€12,300</p>
        </div>
      </div>
      <div class="border-t border-slate-200 dark:border-slate-600 pt-4">
        <span class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ language === 'de' ? 'Netto-Einnahmen' : 'Net Revenue' }}</span>
        <span class="text-xl font-bold text-slate-800 dark:text-slate-50">€36,830</span>
        <span class="text-sm text-green-500 dark:text-green-400 ml-2">+8.2% {{ language === 'de' ? 'vom letzten Monat' : 'from last month' }}</span>
      </div>
    </div>

    <!-- System Alerts -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <AlertTriangle class="h-5 w-5 mr-2 text-yellow-500" />
        {{ language === 'de' ? 'Systemwarnungen' : 'System Alerts' }}
      </h2>
      <div class="space-y-3">
        <div 
          v-for="alert in systemAlerts" 
          :key="alert.id"
          class="p-3 rounded-lg border-l-4 bg-slate-50 dark:bg-slate-700" 
          :class="getBorderColor(alert.type)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ alert.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ alert.description }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ alert.time }}</p>
            </div>
            <AlertTriangle class="h-4 w-4" :class="getAlertIconColor(alert.type)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Zap class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Schnellaktionen' : 'Quick Actions' }}
      </h2>
      <div class="grid grid-cols-2 gap-3">
        <button 
          v-for="action in quickActions" 
          :key="action.id"
          class="p-4 text-left rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <component :is="action.icon" class="h-6 w-6 mb-2 text-blue-600" />
          <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ action.title }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ action.description }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { 
  Users, DollarSign, BookOpen, Calendar, UserPlus, AlertTriangle,
  FileText, MessageSquare, BarChart3, TrendingUp, Clock, Award, Zap
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const keyMetrics = [
  {
    title: language.value === 'de' ? 'Gesamte Schüler' : 'Total Students',
    value: '1,247',
    change: '+12 this month',
    changeColor: 'text-green-500',
    icon: Users,
    iconBg: 'bg-gradient-to-br from-indigo-700 to-blue-600'
  },
  {
    title: language.value === 'de' ? 'Aktive Lehrer' : 'Active Teachers',
    value: '89',
    change: '+3 this month',
    changeColor: 'text-green-500',
    icon: BookOpen,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Monatliche Einnahmen' : 'Monthly Revenue',
    value: '€45.3K',
    change: '+8.2% from last month',
    changeColor: 'text-green-500',
    icon: DollarSign,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Anwesenheitsrate' : 'Attendance Rate',
    value: '94.2%',
    change: '+1.2% from last month',
    changeColor: 'text-green-500',
    icon: Calendar,
    iconBg: 'bg-blue-600'
  }
]

const recentEnrollments = [
  {
    id: 1,
    name: 'Sophie Weber',
    class: 'Class 9A',
    date: 'Today',
    status: 'Pending',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Lucas Schmidt',
    class: 'Class 10B',
    date: 'Yesterday',
    status: 'Approved',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 3,
    name: 'Emma Fischer',
    class: 'Class 8C',
    date: '2 days ago',
    status: 'Review',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
]

const systemAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Server Maintenance Scheduled',
    description: 'System will be down for 2 hours on Sunday',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'error',
    title: 'Payment Gateway Issue',
    description: 'Some payments are failing to process',
    time: '4 hours ago'
  },
  {
    id: 3,
    type: 'info',
    title: 'New Feature Released',
    description: 'Enhanced reporting dashboard is now available',
    time: '1 day ago'
  }
]

const quickActions = [
  {
    id: 1,
    title: language.value === 'de' ? 'Schüler hinzufügen' : 'Add Student',
    description: language.value === 'de' ? 'Neuen Schüler registrieren' : 'Register new student',
    icon: UserPlus
  },
  {
    id: 2,
    title: language.value === 'de' ? 'Berichte generieren' : 'Generate Reports',
    description: language.value === 'de' ? 'Monatliche Berichte erstellen' : 'Create monthly reports',
    icon: FileText
  },
  {
    id: 3,
    title: language.value === 'de' ? 'Nachrichten senden' : 'Send Messages',
    description: language.value === 'de' ? 'An Eltern/Lehrer senden' : 'To parents/teachers',
    icon: MessageSquare
  },
  {
    id: 4,
    title: language.value === 'de' ? 'Analytik anzeigen' : 'View Analytics',
    description: language.value === 'de' ? 'Leistungsmetriken' : 'Performance metrics',
    icon: BarChart3
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'Review':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getBorderColor = (type: string) => {
  switch (type) {
    case 'error':
      return 'border-red-500'
    case 'warning':
      return 'border-yellow-500'
    case 'info':
      return 'border-blue-500'
    default:
      return 'border-gray-500'
  }
}

const getAlertIconColor = (type: string) => {
  switch (type) {
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    default:
      return 'text-gray-500'
  }
}
</script>