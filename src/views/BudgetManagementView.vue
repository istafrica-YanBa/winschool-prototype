<template>
  <div class="budget-management bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <DollarSign class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Budget-Management' : 'Budget Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Budgets, Gebührenstrukturen und finanzielle Planung' : 'Manage budgets, fee structures, and financial planning' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <router-link to="/dashboard/support" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <LifeBuoy class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Support' : 'Support' }}
        </router-link>
        <button @click="showBudgetTemplates = true" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <FileText class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Vorlagen' : 'Templates' }}
        </button>
        <button @click="showMultiYearPlanning = true" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Calendar class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Mehrjahresplanung' : 'Multi-Year' }}
        </button>
        <button @click="showFeeStructure = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <DollarSign class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Gebührenstruktur' : 'Fee Structure' }}
        </button>
      </div>
    </div>

    <!-- Budget Overview -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in budgetStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
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

    <!-- Budget Categories -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
        {{ language === 'de' ? 'Budget-Kategorien' : 'Budget Categories' }}
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="category in budgetCategories" :key="category.id" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ category.name }}</h3>
            <span :class="category.statusColor" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ category.status }}
            </span>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Budget:' : 'Budget:' }}</span>
              <span class="font-medium text-slate-800 dark:text-slate-50">{{ category.budget }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Ausgegeben:' : 'Spent:' }}</span>
              <span class="font-medium text-slate-800 dark:text-slate-50">{{ category.spent }}</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
              <div :class="category.progressColor" class="h-2 rounded-full" :style="{ width: category.percentage + '%' }"></div>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-500 dark:text-slate-400">{{ category.percentage }}% {{ language === 'de' ? 'genutzt' : 'used' }}</span>
              <span class="text-slate-500 dark:text-slate-400">{{ category.remaining }} {{ language === 'de' ? 'verbleibend' : 'remaining' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Rest of content placeholder -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
          {{ language === 'de' ? 'Weitere Funktionen in Entwicklung' : 'Additional Features in Development' }}
        </h2>
        <p class="text-slate-600 dark:text-slate-400">
          {{ language === 'de' 
            ? 'Weitere Budget-Management-Funktionen werden bald verfügbar sein.' 
            : 'Additional budget management features will be available soon.' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  FileText, Calendar, DollarSign, Plus, Edit, Copy, Trash2, X, Eye, Download,
  TrendingUp, TrendingDown, CheckCircle, Play, BarChart3, RefreshCw, LifeBuoy
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showBudgetTemplates = ref(false)
const showMultiYearPlanning = ref(false)
const showFeeStructure = ref(false)

const budgetStats = [
  {
    title: language.value === 'de' ? 'Gesamtbudget' : 'Total Budget',
    value: '€2.4M',
    change: '+8.2% from last year',
    changeColor: 'text-green-500',
    icon: DollarSign,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Ausgegeben' : 'Spent',
    value: '€1.8M',
    change: '75% of budget',
    changeColor: 'text-blue-500',
    icon: TrendingDown,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Verbleibend' : 'Remaining',
    value: '€600K',
    change: '25% remaining',
    changeColor: 'text-yellow-500',
    icon: BarChart3,
    iconBg: 'bg-yellow-600'
  },
  {
    title: language.value === 'de' ? 'Überfällige Zahlungen' : 'Overdue Payments',
    value: '€45K',
    change: '-12% from last month',
    changeColor: 'text-green-500',
    icon: RefreshCw,
    iconBg: 'bg-red-600'
  }
]

const budgetCategories = [
  {
    id: 1,
    name: language.value === 'de' ? 'Lehrergehälter' : 'Teacher Salaries',
    budget: '€850K',
    spent: '€650K',
    remaining: '€200K',
    percentage: 76,
    status: language.value === 'de' ? 'Auf Kurs' : 'On Track',
    statusColor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    progressColor: 'bg-green-500'
  },
  {
    id: 2,
    name: language.value === 'de' ? 'Infrastruktur' : 'Infrastructure',
    budget: '€400K',
    spent: '€350K',
    remaining: '€50K',
    percentage: 88,
    status: language.value === 'de' ? 'Warnung' : 'Warning',
    statusColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    progressColor: 'bg-yellow-500'
  },
  {
    id: 3,
    name: language.value === 'de' ? 'Lehrmaterialien' : 'Teaching Materials',
    budget: '€200K',
    spent: '€120K',
    remaining: '€80K',
    percentage: 60,
    status: language.value === 'de' ? 'Gut' : 'Good',
    statusColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    progressColor: 'bg-blue-500'
  },
  {
    id: 4,
    name: language.value === 'de' ? 'Technologie' : 'Technology',
    budget: '€300K',
    spent: '€290K',
    remaining: '€10K',
    percentage: 97,
    status: language.value === 'de' ? 'Kritisch' : 'Critical',
    statusColor: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    progressColor: 'bg-red-500'
  }
]

// Rest of script content
</script>
