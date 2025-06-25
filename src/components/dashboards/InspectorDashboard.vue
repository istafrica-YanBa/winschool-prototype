<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Regional Overview -->
    <div class="lg:col-span-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Shield class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Regionale Übersicht' : 'Regional Overview' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div v-for="metric in regionalMetrics" :key="metric.title" class="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div :class="metric.iconBg" class="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
            <component :is="metric.icon" class="h-6 w-6 text-white" />
          </div>
          <p class="text-2xl font-bold text-slate-800 dark:text-slate-50">{{ metric.value }}</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ metric.title }}</p>
          <p :class="metric.changeColor" class="text-xs mt-1">{{ metric.change }}</p>
        </div>
      </div>
    </div>

    <!-- Institution Compliance -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <CheckCircle class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Institutionen-Compliance' : 'Institution Compliance' }}
      </h2>
      <div class="space-y-4">
        <div v-for="institution in institutionCompliance" :key="institution.name" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ institution.name }}</h3>
            <span :class="getComplianceColor(institution.score)" class="text-sm font-semibold">{{ institution.score }}%</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
            <div :class="getComplianceColor(institution.score, true)" class="h-2 rounded-full" :style="{ width: institution.score + '%' }"></div>
          </div>
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{{ institution.students }} students</span>
            <span>Last audit: {{ institution.lastAudit }}</span>
          </div>
          <div class="mt-2">
            <span :class="getStatusColor(institution.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ institution.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Policy Compliance Trends -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <TrendingUp class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Policy-Compliance-Trends' : 'Policy Compliance Trends' }}
      </h2>
      <div class="space-y-4">
        <div v-for="policy in policyCompliance" :key="policy.name" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ policy.name }}</h3>
            <div class="flex items-center space-x-2">
              <span :class="getTrendColor(policy.trend)" class="text-sm">{{ policy.trend }}</span>
              <component :is="getTrendIcon(policy.trend)" class="h-4 w-4" :class="getTrendColor(policy.trend)" />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 text-sm">
            <div class="text-center">
              <p class="text-slate-500 dark:text-slate-400">Compliant</p>
              <p class="font-semibold text-green-500">{{ policy.compliant }}</p>
            </div>
            <div class="text-center">
              <p class="text-slate-500 dark:text-slate-400">Partial</p>
              <p class="font-semibold text-yellow-500">{{ policy.partial }}</p>
            </div>
            <div class="text-center">
              <p class="text-slate-500 dark:text-slate-400">Non-Compliant</p>
              <p class="font-semibold text-red-500">{{ policy.nonCompliant }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audit Schedule -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Calendar class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Audit-Zeitplan' : 'Audit Schedule' }}
      </h2>
      <div class="space-y-3">
        <div v-for="audit in upcomingAudits" :key="audit.id" class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ audit.institution }}</h3>
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ audit.date }}</span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ audit.type }}</p>
          <div class="flex justify-between items-center mt-2">
            <span :class="getAuditTypeColor(audit.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ audit.priority }}
            </span>
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ audit.inspector }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Government Reports -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <FileText class="h-5 w-5 mr-2 text-green-500" />
        {{ language === 'de' ? 'Regierungsberichte' : 'Government Reports' }}
      </h2>
      <div class="space-y-3">
        <div v-for="report in governmentReports" :key="report.id" class="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ report.title }}</h3>
            <span :class="getReportStatusColor(report.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ report.status }}
            </span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ report.description }}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-xs text-slate-500 dark:text-slate-400">Due: {{ report.dueDate }}</span>
            <button class="text-xs text-blue-600 hover:text-indigo-700 transition-colors">
              {{ language === 'de' ? 'Herunterladen' : 'Download' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { 
  Shield, CheckCircle, TrendingUp, TrendingDown, Minus, Calendar, FileText,
  Building, Users, BookOpen, Award, AlertTriangle
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const regionalMetrics = [
  {
    title: language.value === 'de' ? 'Institutionen' : 'Institutions',
    value: '47',
    change: '+2 this year',
    changeColor: 'text-green-500',
    icon: Building,
    iconBg: 'bg-gradient-to-br from-indigo-700 to-blue-600'
  },
  {
    title: language.value === 'de' ? 'Schüler' : 'Students',
    value: '58.7K',
    change: '+3.2% this year',
    changeColor: 'text-green-500',
    icon: Users,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Lehrer' : 'Teachers',
    value: '4,180',
    change: '+1.8% this year',
    changeColor: 'text-green-500',
    icon: BookOpen,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Compliance' : 'Compliance',
    value: '92.4%',
    change: '+2.1% this quarter',
    changeColor: 'text-green-500',
    icon: CheckCircle,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Auszeichnungen' : 'Awards',
    value: '156',
    change: '+12 this year',
    changeColor: 'text-green-500',
    icon: Award,
    iconBg: 'bg-yellow-500'
  }
]

const institutionCompliance = [
  { name: 'Gymnasium Berlin-Mitte', score: 96, students: 1247, lastAudit: 'Jan 2024', status: 'Excellent' },
  { name: 'Realschule Hamburg-Nord', score: 88, students: 890, lastAudit: 'Feb 2024', status: 'Good' },
  { name: 'Gesamtschule München-Süd', score: 92, students: 1456, lastAudit: 'Mar 2024', status: 'Excellent' },
  { name: 'Hauptschule Köln-West', score: 78, students: 654, lastAudit: 'Jan 2024', status: 'Needs Improvement' }
]

const policyCompliance = [
  { name: 'Data Protection (GDPR)', compliant: 42, partial: 4, nonCompliant: 1, trend: 'up' },
  { name: 'Student Safety', compliant: 45, partial: 2, nonCompliant: 0, trend: 'up' },
  { name: 'Curriculum Standards', compliant: 38, partial: 7, nonCompliant: 2, trend: 'stable' },
  { name: 'Teacher Qualifications', compliant: 44, partial: 3, nonCompliant: 0, trend: 'up' }
]

const upcomingAudits = [
  { id: 1, institution: 'Gymnasium Dresden', type: 'Compliance Audit', date: 'Next Week', priority: 'High', inspector: 'Dr. Bauer' },
  { id: 2, institution: 'Realschule Frankfurt', type: 'Safety Inspection', date: 'Mar 25', priority: 'Medium', inspector: 'Prof. Weber' },
  { id: 3, institution: 'Gesamtschule Stuttgart', type: 'Academic Review', date: 'Apr 2', priority: 'Low', inspector: 'Ms. Schmidt' }
]

const governmentReports = [
  { id: 1, title: 'Quarterly Education Report', description: 'Regional performance summary', status: 'Ready', dueDate: 'Mar 31' },
  { id: 2, title: 'GDPR Compliance Report', description: 'Data protection compliance status', status: 'In Progress', dueDate: 'Apr 15' },
  { id: 3, title: 'Teacher Development Report', description: 'Professional development statistics', status: 'Draft', dueDate: 'Apr 30' }
]

const getComplianceColor = (score: number, isBg = false) => {
  if (score >= 90) return isBg ? 'bg-green-500' : 'text-green-500'
  if (score >= 80) return isBg ? 'bg-blue-500' : 'text-blue-600'
  if (score >= 70) return isBg ? 'bg-yellow-500' : 'text-yellow-500'
  return isBg ? 'bg-red-500' : 'text-red-500'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Excellent':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Good':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Needs Improvement':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'text-green-500'
    case 'down':
      return 'text-red-500'
    case 'stable':
      return 'text-slate-500'
    default:
      return 'text-slate-500'
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    case 'stable':
      return Minus
    default:
      return Minus
  }
}

const getAuditTypeColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'Low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getReportStatusColor = (status: string) => {
  switch (status) {
    case 'Ready':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}
</script>