<template>
  <div class="reports bg-gray-50 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <BarChart3 class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Noten & Berichte' : 'Grades & Reports' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Erstellen und verwalten Sie Berichte und Analysen' : 'Create and manage reports and analytics' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="generateReport" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Neuer Bericht' : 'New Report' }}
          </button>
          <button @click="exportReports" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Download class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
        </div>
      </div>

      <!-- Report Categories -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="category in reportCategories" :key="category.title" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover cursor-pointer">
          <div class="flex items-center mb-4">
            <div :class="category.iconBg" class="p-3 rounded-lg">
              <component :is="category.icon" class="h-6 w-6 text-white" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ category.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ category.description }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <div v-for="report in category.reports" :key="report" class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 cursor-pointer">
              • {{ report }}
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Aktuelle Berichte' : 'Recent Reports' }}
          </h2>
          <div class="flex space-x-2">
            <select class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>{{ language === 'de' ? 'Alle Kategorien' : 'All Categories' }}</option>
              <option>{{ language === 'de' ? 'Akademisch' : 'Academic' }}</option>
              <option>{{ language === 'de' ? 'Finanziell' : 'Financial' }}</option>
              <option>{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Berichtsname' : 'Report Name' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Kategorie' : 'Category' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Erstellt von' : 'Created By' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Datum' : 'Date' }}
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
              <tr v-for="report in recentReports" :key="report.id" class="border-b border-gray-100 dark:border-gray-700">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <FileText class="h-5 w-5 text-gray-400 mr-3" />
                    <span class="font-medium text-gray-900 dark:text-white">{{ report.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span :class="getCategoryColor(report.category)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ report.category }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ report.createdBy }}</td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ report.date }}</td>
                <td class="py-3 px-4">
                  <span :class="getStatusColor(report.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ report.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button class="text-primary-600 hover:text-primary-800">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button class="text-green-600 hover:text-green-800">
                      <Download class="h-4 w-4" />
                    </button>
                    <button class="text-gray-600 hover:text-gray-800">
                      <Share class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Analytics Dashboard -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Performance Trends -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Leistungstrends' : 'Performance Trends' }}
          </h3>
          <div class="space-y-4">
            <div v-for="trend in performanceTrends" :key="trend.metric" class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ trend.metric }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ trend.period }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ trend.value }}</p>
                <p :class="trend.changeColor" class="text-sm flex items-center">
                  <component :is="trend.trendIcon" class="h-4 w-4 mr-1" />
                  {{ trend.change }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Insights -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ language === 'de' ? 'Schnelle Einblicke' : 'Quick Insights' }}
          </h3>
          <div class="space-y-4">
            <div v-for="insight in quickInsights" :key="insight.title" class="p-4 border-l-4" :class="insight.borderColor">
              <h4 class="font-medium text-gray-900 dark:text-white">{{ insight.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ insight.description }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">{{ insight.recommendation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import {
  Plus, FileText, BarChart3, DollarSign, Calendar,
  Eye, Download, Share, TrendingUp
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const reportCategories = [
  {
    title: language.value === 'de' ? 'Akademische Berichte' : 'Academic Reports',
    description: language.value === 'de' ? 'Noten, Leistung, Bewertungen' : 'Grades, performance, assessments',
    icon: BarChart3,
    iconBg: 'bg-primary-600',
    reports: [
      language.value === 'de' ? 'Klassendurchschnitte' : 'Class Averages',
      language.value === 'de' ? 'Schülerleistung' : 'Student Performance',
      language.value === 'de' ? 'Fachanalyse' : 'Subject Analysis'
    ]
  },
  {
    title: language.value === 'de' ? 'Finanzberichte' : 'Financial Reports',
    description: language.value === 'de' ? 'Gebühren, Zahlungen, Budget' : 'Fees, payments, budget',
    icon: DollarSign,
    iconBg: 'bg-green-600',
    reports: [
      language.value === 'de' ? 'Einnahmenübersicht' : 'Revenue Overview',
      language.value === 'de' ? 'Ausstehende Zahlungen' : 'Outstanding Payments',
      language.value === 'de' ? 'Finanzielle Hilfe' : 'Financial Aid'
    ]
  },
  {
    title: language.value === 'de' ? 'Anwesenheitsberichte' : 'Attendance Reports',
    description: language.value === 'de' ? 'Anwesenheit, Abwesenheit' : 'Attendance, absences',
    icon: Calendar,
    iconBg: 'bg-blue-600',
    reports: [
      language.value === 'de' ? 'Tägliche Anwesenheit' : 'Daily Attendance',
      language.value === 'de' ? 'Abwesenheitstrends' : 'Absence Trends',
      language.value === 'de' ? 'Klassenanwesenheit' : 'Class Attendance'
    ]
  }
]

const recentReports = [
  {
    id: 1,
    name: 'Monthly Academic Performance',
    category: 'Academic',
    createdBy: 'Dr. Weber',
    date: '2024-03-10',
    status: 'Ready'
  },
  {
    id: 2,
    name: 'Financial Summary Q1',
    category: 'Financial',
    createdBy: 'Sarah Fischer',
    date: '2024-03-09',
    status: 'Processing'
  },
  {
    id: 3,
    name: 'Attendance Analysis',
    category: 'Attendance',
    createdBy: 'Ms. Schmidt',
    date: '2024-03-08',
    status: 'Ready'
  },
  {
    id: 4,
    name: 'Student Enrollment Report',
    category: 'Administrative',
    createdBy: 'Admin Office',
    date: '2024-03-07',
    status: 'Draft'
  }
]

const performanceTrends = [
  {
    metric: language.value === 'de' ? 'Durchschnittsnote' : 'Average Grade',
    period: language.value === 'de' ? 'Dieses Semester' : 'This Semester',
    value: 'B+',
    change: '+0.3',
    changeColor: 'text-green-600',
    trendIcon: TrendingUp
  },
  {
    metric: language.value === 'de' ? 'Anwesenheitsrate' : 'Attendance Rate',
    period: language.value === 'de' ? 'Dieser Monat' : 'This Month',
    value: '94.2%',
    change: '+1.2%',
    changeColor: 'text-green-600',
    trendIcon: TrendingUp
  },
  {
    metric: language.value === 'de' ? 'Schüleranzahl' : 'Student Count',
    period: language.value === 'de' ? 'Aktuell' : 'Current',
    value: '1,247',
    change: '+12',
    changeColor: 'text-green-600',
    trendIcon: TrendingUp
  }
]

const quickInsights = [
  {
    title: language.value === 'de' ? 'Mathematikleistung verbessert' : 'Mathematics Performance Improved',
    description: language.value === 'de' ? 'Klassendurchschnitt um 0.5 Punkte gestiegen' : 'Class average increased by 0.5 points',
    recommendation: language.value === 'de' ? 'Aktuelle Lehrmethoden beibehalten' : 'Continue current teaching methods',
    borderColor: 'border-green-500'
  },
  {
    title: language.value === 'de' ? 'Anwesenheit in Klasse 9B niedrig' : 'Low Attendance in Class 9B',
    description: language.value === 'de' ? 'Anwesenheitsrate unter dem Durchschnitt' : 'Attendance rate below average',
    recommendation: language.value === 'de' ? 'Elternkontakt empfohlen' : 'Parent contact recommended',
    borderColor: 'border-yellow-500'
  },
  {
    title: language.value === 'de' ? 'Finanzielle Hilfe Anträge steigen' : 'Financial Aid Applications Rising',
    description: language.value === 'de' ? '15% Anstieg in diesem Quartal' : '15% increase this quarter',
    recommendation: language.value === 'de' ? 'Budget für Hilfe überprüfen' : 'Review aid budget allocation',
    borderColor: 'border-blue-500'
  }
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Academic':
      return 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
    case 'Financial':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Attendance':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Administrative':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ready':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const generateReport = () => {
  // Implementation of generateReport function
  console.log('Generating new report...')
}

const exportReports = () => {
  // Implementation of exportReports function
  console.log('Exporting reports...')
}
</script>
