<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <TrendingUp class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Budget-Ressourcen' : 'Budget Resources' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Überwachen Sie Finanzen nach Kategorie und Abteilung' : 'Monitor financials by category and department' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="generateReport" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <FileText class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Bericht' : 'Report' }}
        </button>
        <button @click="showAddBudget = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Budget hinzufügen' : 'Add Budget' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
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

    <!-- Filters Panel -->
    <div v-if="showFilters" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
        {{ language === 'de' ? 'Filter' : 'Filters' }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Zeitraum' : 'Time Period' }}
          </label>
          <select v-model="filters.period" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="current-month">{{ language === 'de' ? 'Aktueller Monat' : 'Current Month' }}</option>
            <option value="last-month">{{ language === 'de' ? 'Letzter Monat' : 'Last Month' }}</option>
            <option value="quarter">{{ language === 'de' ? 'Quartal' : 'Quarter' }}</option>
            <option value="year">{{ language === 'de' ? 'Jahr' : 'Year' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Abteilung' : 'Department' }}
          </label>
          <select v-model="filters.department" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Abteilungen' : 'All Departments' }}</option>
            <option value="Science">{{ language === 'de' ? 'Naturwissenschaften' : 'Science' }}</option>
            <option value="Mathematics">{{ language === 'de' ? 'Mathematik' : 'Mathematics' }}</option>
            <option value="Literature">{{ language === 'de' ? 'Literatur' : 'Literature' }}</option>
            <option value="Technology">{{ language === 'de' ? 'Technologie' : 'Technology' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Kategorie' : 'Category' }}
          </label>
          <select v-model="filters.category" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Kategorien' : 'All Categories' }}</option>
            <option value="Equipment">{{ language === 'de' ? 'Ausrüstung' : 'Equipment' }}</option>
            <option value="Books">{{ language === 'de' ? 'Bücher' : 'Books' }}</option>
            <option value="Software">{{ language === 'de' ? 'Software' : 'Software' }}</option>
            <option value="Supplies">{{ language === 'de' ? 'Verbrauchsmaterial' : 'Supplies' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Status' : 'Status' }}
          </label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="Allocated">{{ language === 'de' ? 'Zugewiesen' : 'Allocated' }}</option>
            <option value="Spent">{{ language === 'de' ? 'Ausgegeben' : 'Spent' }}</option>
            <option value="Available">{{ language === 'de' ? 'Verfügbar' : 'Available' }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Budget Overview Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Department Budget Distribution -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
          {{ language === 'de' ? 'Budget nach Abteilung' : 'Budget by Department' }}
        </h3>
        <div class="space-y-4">
          <div v-for="dept in departmentBudgets" :key="dept.name" class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div :class="dept.color" class="w-3 h-3 rounded-full"></div>
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ dept.name }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-slate-800 dark:text-slate-200">€{{ dept.allocated.toLocaleString() }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ dept.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Spending -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
          {{ language === 'de' ? 'Ausgaben nach Kategorie' : 'Spending by Category' }}
        </h3>
        <div class="space-y-4">
          <div v-for="category in categorySpending" :key="category.name" class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div :class="category.color" class="w-3 h-3 rounded-full"></div>
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ category.name }}</span>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-slate-800 dark:text-slate-200">€{{ category.spent.toLocaleString() }}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ ((category.spent / category.budget) * 100).toFixed(1) }}% {{ language === 'de' ? 'verwendet' : 'used' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Budget Allocations Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Budget-Zuweisungen' : 'Budget Allocations' }}
        </h2>
        
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Abteilung' : 'Department' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Kategorie' : 'Category' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Zugewiesen' : 'Allocated' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Ausgegeben' : 'Spent' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Verbleibt' : 'Remaining' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Status' : 'Status' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="allocation in filteredAllocations" :key="allocation.id" class="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ allocation.department }}</div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {{ allocation.category }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">€{{ allocation.allocated.toLocaleString() }}</td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">€{{ allocation.spent.toLocaleString() }}</td>
                <td class="py-3 px-4">
                  <span :class="allocation.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                    €{{ allocation.remaining.toLocaleString() }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getBudgetStatusColor(allocation)">
                    {{ language === 'de' ? getBudgetStatusTranslation(allocation.status) : allocation.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewAllocationDetails(allocation)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" :title="language === 'de' ? 'Details anzeigen' : 'View Details'">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="editAllocation(allocation)" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" :title="language === 'de' ? 'Bearbeiten' : 'Edit'">
                      <Edit class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <div v-for="allocation in filteredAllocations" :key="allocation.id" class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-medium text-slate-800 dark:text-slate-200">{{ allocation.department }}</h3>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {{ allocation.category }}
                </span>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getBudgetStatusColor(allocation)">
                {{ language === 'de' ? getBudgetStatusTranslation(allocation.status) : allocation.status }}
              </span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Zugewiesen:' : 'Allocated:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">€{{ allocation.allocated.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Ausgegeben:' : 'Spent:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">€{{ allocation.spent.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Verbleibt:' : 'Remaining:' }}</span>
                <span :class="allocation.remaining < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'" class="text-sm">
                  €{{ allocation.remaining.toLocaleString() }}
                </span>
              </div>
              <div class="flex justify-end space-x-2 mt-3">
                <button @click="viewAllocationDetails(allocation)" class="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800 rounded-lg">
                  <Eye class="h-4 w-4" />
                </button>
                <button @click="editAllocation(allocation)" class="p-2 bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800 rounded-lg">
                  <Edit class="h-4 w-4" />
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
import { useLanguageStore } from '@/stores/language'
import {
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Edit,
  FileText,
  Plus
} from 'lucide-vue-next'

const languageStore = useLanguageStore()
const language = computed(() => languageStore.language)

// Reactive data
const showFilters = ref(false)
const showAddBudget = ref(false)

const filters = ref({
  period: 'current-month',
  department: '',
  category: '',
  status: ''
})

// Mock data
const budgetAllocations = ref([
  {
    id: 1,
    department: 'Science',
    category: 'Equipment',
    allocated: 50000,
    spent: 32000,
    remaining: 18000,
    status: 'On Track',
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    department: 'Mathematics',
    category: 'Books',
    allocated: 15000,
    spent: 16500,
    remaining: -1500,
    status: 'Over Budget',
    lastUpdated: '2024-01-14'
  },
  {
    id: 3,
    department: 'Literature',
    category: 'Books',
    allocated: 20000,
    spent: 12000,
    remaining: 8000,
    status: 'Under Budget',
    lastUpdated: '2024-01-13'
  },
  {
    id: 4,
    department: 'Technology',
    category: 'Software',
    allocated: 30000,
    spent: 28000,
    remaining: 2000,
    status: 'At Risk',
    lastUpdated: '2024-01-12'
  },
  {
    id: 5,
    department: 'Science',
    category: 'Supplies',
    allocated: 8000,
    spent: 3500,
    remaining: 4500,
    status: 'On Track',
    lastUpdated: '2024-01-11'
  }
])

const departmentBudgets = ref([
  { name: 'Science', allocated: 58000, color: 'bg-blue-500', percentage: 47.2 },
  { name: 'Technology', allocated: 30000, color: 'bg-green-500', percentage: 24.4 },
  { name: 'Literature', allocated: 20000, color: 'bg-purple-500', percentage: 16.3 },
  { name: 'Mathematics', allocated: 15000, color: 'bg-yellow-500', percentage: 12.2 }
])

const categorySpending = ref([
  { name: 'Equipment', spent: 32000, budget: 50000, color: 'bg-indigo-500' },
  { name: 'Software', spent: 28000, budget: 30000, color: 'bg-cyan-500' },
  { name: 'Books', spent: 28500, budget: 35000, color: 'bg-pink-500' },
  { name: 'Supplies', spent: 3500, budget: 8000, color: 'bg-orange-500' }
])

// Computed properties
const budgetStats = computed(() => [
  {
    title: language.value === 'de' ? 'Gesamtbudget' : 'Total Budget',
    value: `€${budgetAllocations.value.reduce((sum, a) => sum + a.allocated, 0).toLocaleString()}`,
    change: language.value === 'de' ? '+5% vom Vorjahr' : '+5% from last year',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: DollarSign,
    iconBg: 'bg-blue-500'
  },
  {
    title: language.value === 'de' ? 'Ausgegeben' : 'Total Spent',
    value: `€${budgetAllocations.value.reduce((sum, a) => sum + a.spent, 0).toLocaleString()}`,
    change: language.value === 'de' ? '74% des Budgets' : '74% of budget',
    changeColor: 'text-yellow-600 dark:text-yellow-400',
    icon: TrendingUp,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Verbleibt' : 'Remaining',
    value: `€${budgetAllocations.value.reduce((sum, a) => sum + a.remaining, 0).toLocaleString()}`,
    change: language.value === 'de' ? '26% verfügbar' : '26% available',
    changeColor: 'text-blue-600 dark:text-blue-400',
    icon: TrendingDown,
    iconBg: 'bg-purple-500'
  },
  {
    title: language.value === 'de' ? 'Überzogene Budgets' : 'Over Budget',
    value: budgetAllocations.value.filter(a => a.remaining < 0).length.toString(),
    change: language.value === 'de' ? 'Benötigen Aufmerksamkeit' : 'Need attention',
    changeColor: 'text-red-600 dark:text-red-400',
    icon: AlertTriangle,
    iconBg: 'bg-red-500'
  }
])

const filteredAllocations = computed(() => {
  let allocations = budgetAllocations.value

  // Apply department filter
  if (filters.value.department) {
    allocations = allocations.filter(a => a.department === filters.value.department)
  }

  // Apply category filter
  if (filters.value.category) {
    allocations = allocations.filter(a => a.category === filters.value.category)
  }

  // Apply status filter
  if (filters.value.status) {
    allocations = allocations.filter(a => a.status === filters.value.status)
  }

  return allocations
})

// Methods
const getBudgetStatusColor = (allocation: any) => {
  switch (allocation.status) {
    case 'On Track':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'At Risk':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'Over Budget':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'Under Budget':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getBudgetStatusTranslation = (status: string) => {
  const translations: { [key: string]: string } = {
    'On Track': 'Im Plan',
    'At Risk': 'Gefährdet',
    'Over Budget': 'Überzogen',
    'Under Budget': 'Unter Budget'
  }
  return translations[status] || status
}

const viewAllocationDetails = (allocation: any) => {
  // In a real app, this would show detailed allocation information
  console.log('View allocation details:', allocation)
}

const editAllocation = (allocation: any) => {
  // In a real app, this would open an edit modal
  console.log('Edit allocation:', allocation)
}

const generateReport = () => {
  // In a real app, this would generate and download a budget report
  console.log('Generating budget report...')
  alert(language.value === 'de' ? 'Budget-Bericht wird generiert...' : 'Generating budget report...')
}
</script> 