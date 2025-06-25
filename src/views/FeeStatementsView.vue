<template>
  <div class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
    <div class="p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Receipt class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800 dark:text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Gebührenabrechnungen' : 'Fee Statements' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Gebühren und Zahlungen für Ihre Kinder' : 'Manage fees and payments for your children' }}
            </p>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button class="w-full sm:w-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Download class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Alle herunterladen' : 'Download All' }}
          </button>
          <button class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-gradient-to-r dark:from-indigo-700 dark:to-blue-600 dark:hover:from-indigo-800 dark:hover:to-blue-700 text-slate-800 dark:text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <CreditCard class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Zahlung vornehmen' : 'Make Payment' }}
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Bezahlt' : 'Paid' }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">€{{ totalPaid.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertCircle class="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Ausstehend' : 'Outstanding' }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">€{{ totalOutstanding.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Überfällig' : 'Overdue' }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">€{{ totalOverdue.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Receipt class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Gesamt' : 'Total' }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">€{{ totalAmount.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Child Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Kind auswählen' : 'Select Child' }}
            </label>
            <select
              v-model="selectedChild"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{{ language === 'de' ? 'Alle Kinder' : 'All Children' }}</option>
              <option v-for="child in children" :key="child.id" :value="child.id">
                {{ child.name }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Status' : 'Status' }}
            </label>
            <select
              v-model="selectedStatus"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{{ language === 'de' ? 'Alle Status' : 'All Statuses' }}</option>
              <option value="paid">{{ language === 'de' ? 'Bezahlt' : 'Paid' }}</option>
              <option value="outstanding">{{ language === 'de' ? 'Ausstehend' : 'Outstanding' }}</option>
              <option value="overdue">{{ language === 'de' ? 'Überfällig' : 'Overdue' }}</option>
            </select>
          </div>

          <!-- Academic Year Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Schuljahr' : 'Academic Year' }}
            </label>
            <select
              v-model="selectedYear"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{{ language === 'de' ? 'Alle Jahre' : 'All Years' }}</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Suchen' : 'Search' }}
            </label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="language === 'de' ? 'Rechnungsnummer oder Beschreibung...' : 'Invoice number or description...'"
                class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-winschool-primary dark:focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Fee Statements List -->
      <div class="space-y-4">
        <div v-if="filteredStatements.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Receipt class="h-8 w-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ language === 'de' ? 'Keine Gebührenabrechnungen gefunden' : 'No fee statements found' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            {{ language === 'de' ? 'Versuchen Sie, Ihre Filter zu ändern' : 'Try adjusting your filters' }}
          </p>
        </div>

        <div
          v-for="statement in filteredStatements"
          :key="statement.id"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <!-- Statement Header -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <img
                    :src="statement.child.avatar"
                    :alt="statement.child.name"
                    class="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ statement.child.name }}
                    </h3>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ statement.child.class }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {{ language === 'de' ? 'Rechnung' : 'Invoice' }} #{{ statement.invoiceNumber }}
                  </p>
                  <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <div class="flex items-center">
                      <Calendar class="h-3 w-3 mr-1" />
                      {{ statement.issueDate }}
                    </div>
                    <div class="flex items-center">
                      <Clock class="h-3 w-3 mr-1" />
                      {{ language === 'de' ? 'Fällig am' : 'Due' }} {{ statement.dueDate }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Amount and Status -->
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  €{{ statement.amount.toLocaleString() }}
                </p>
                <div class="mt-2">
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                    getStatusStyle(statement.status)
                  ]">
                    <component :is="getStatusIcon(statement.status)" class="h-3 w-3 mr-1" />
                    {{ getStatusText(statement.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Fee Items -->
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {{ language === 'de' ? 'Gebührenaufstellung' : 'Fee Breakdown' }}
              </h4>
              <div class="space-y-2">
                <div
                  v-for="item in statement.items"
                  :key="item.id"
                  class="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.description }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.period }}</p>
                  </div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    €{{ item.amount.toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex flex-wrap gap-3">
              <button
                @click="downloadStatement(statement)"
                class="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Download class="h-4 w-4 mr-2" />
                {{ language === 'de' ? 'Herunterladen' : 'Download' }}
              </button>

              <button
                v-if="statement.status !== 'paid'"
                @click="makePayment(statement)"
                class="inline-flex items-center px-4 py-2 text-sm font-medium bg-winschool-primary hover:bg-winschool-primary-dark dark:bg-indigo-600 dark:hover:bg-indigo-700 text-slate-800 dark:text-white rounded-lg transition-colors"
              >
                <CreditCard class="h-4 w-4 mr-2" />
                {{ language === 'de' ? 'Bezahlen' : 'Pay Now' }}
              </button>

              <button
                @click="viewDetails(statement)"
                class="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Eye class="h-4 w-4 mr-2" />
                {{ language === 'de' ? 'Details' : 'View Details' }}
              </button>

              <button
                v-if="statement.status === 'overdue'"
                @click="requestExtension(statement)"
                class="inline-flex items-center px-4 py-2 text-sm font-medium border border-orange-300 dark:border-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-700 dark:text-orange-300 transition-colors"
              >
                <Clock class="h-4 w-4 mr-2" />
                {{ language === 'de' ? 'Verlängerung beantragen' : 'Request Extension' }}
              </button>
            </div>
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
  Receipt, 
  Download, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Search,
  Calendar,
  Eye,
  XCircle
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Filters
const selectedChild = ref('')
const selectedStatus = ref('')
const selectedYear = ref('')
const searchQuery = ref('')

// Sample data - children
const children = ref([
  {
    id: 1,
    name: 'Emma Schmidt',
    class: '7A',
    avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Max Schmidt',
    class: '9B',
    avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
])

// Sample data - fee statements
const feeStatements = ref([
  {
    id: 1,
    child: children.value[0],
    invoiceNumber: 'INV-2024-001',
    amount: 2450,
    status: 'outstanding',
    issueDate: '2024-03-01',
    dueDate: '2024-03-31',
    academicYear: '2024-2025',
    items: [
      { id: 1, description: language.value === 'de' ? 'Schulgebühren' : 'Tuition Fee', period: language.value === 'de' ? 'März 2024' : 'March 2024', amount: 1800 },
      { id: 2, description: language.value === 'de' ? 'Lehrmaterialien' : 'Learning Materials', period: language.value === 'de' ? 'Semester 2' : 'Semester 2', amount: 350 },
      { id: 3, description: language.value === 'de' ? 'Schulausflug' : 'School Trip', period: language.value === 'de' ? 'März 2024' : 'March 2024', amount: 300 }
    ]
  },
  {
    id: 2,
    child: children.value[1],
    invoiceNumber: 'INV-2024-002',
    amount: 2800,
    status: 'paid',
    issueDate: '2024-02-01',
    dueDate: '2024-02-28',
    academicYear: '2024-2025',
    items: [
      { id: 1, description: language.value === 'de' ? 'Schulgebühren' : 'Tuition Fee', period: language.value === 'de' ? 'Februar 2024' : 'February 2024', amount: 2000 },
      { id: 2, description: language.value === 'de' ? 'Laborgebühren' : 'Lab Fees', period: language.value === 'de' ? 'Semester 2' : 'Semester 2', amount: 500 },
      { id: 3, description: language.value === 'de' ? 'Sportaktivitäten' : 'Sports Activities', period: language.value === 'de' ? 'Februar 2024' : 'February 2024', amount: 300 }
    ]
  },
  {
    id: 3,
    child: children.value[0],
    invoiceNumber: 'INV-2024-003',
    amount: 1500,
    status: 'overdue',
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
    academicYear: '2024-2025',
    items: [
      { id: 1, description: language.value === 'de' ? 'Nachprüfungsgebühren' : 'Exam Re-sit Fees', period: language.value === 'de' ? 'Januar 2024' : 'January 2024', amount: 800 },
      { id: 2, description: language.value === 'de' ? 'Zusatzunterricht' : 'Extra Classes', period: language.value === 'de' ? 'Januar 2024' : 'January 2024', amount: 700 }
    ]
  },
  {
    id: 4,
    child: children.value[1],
    invoiceNumber: 'INV-2023-045',
    amount: 3200,
    status: 'paid',
    issueDate: '2023-12-01',
    dueDate: '2023-12-31',
    academicYear: '2023-2024',
    items: [
      { id: 1, description: language.value === 'de' ? 'Schulgebühren' : 'Tuition Fee', period: language.value === 'de' ? 'Dezember 2023' : 'December 2023', amount: 2200 },
      { id: 2, description: language.value === 'de' ? 'Computergebühren' : 'Computer Lab Fees', period: language.value === 'de' ? 'Semester 1' : 'Semester 1', amount: 600 },
      { id: 3, description: language.value === 'de' ? 'Bibliotheksgebühren' : 'Library Fees', period: language.value === 'de' ? 'Schuljahr 2023-24' : 'Academic Year 2023-24', amount: 400 }
    ]
  }
])

// Computed properties for summary
const totalPaid = computed(() => {
  return feeStatements.value
    .filter(s => s.status === 'paid')
    .reduce((sum, s) => sum + s.amount, 0)
})

const totalOutstanding = computed(() => {
  return feeStatements.value
    .filter(s => s.status === 'outstanding')
    .reduce((sum, s) => sum + s.amount, 0)
})

const totalOverdue = computed(() => {
  return feeStatements.value
    .filter(s => s.status === 'overdue')
    .reduce((sum, s) => sum + s.amount, 0)
})

const totalAmount = computed(() => {
  return feeStatements.value.reduce((sum, s) => sum + s.amount, 0)
})

// Filtered statements
const filteredStatements = computed(() => {
  let filtered = feeStatements.value

  if (selectedChild.value) {
    filtered = filtered.filter(s => s.child.id === parseInt(selectedChild.value))
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(s => s.status === selectedStatus.value)
  }

  if (selectedYear.value) {
    filtered = filtered.filter(s => s.academicYear === selectedYear.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s => 
      s.invoiceNumber.toLowerCase().includes(query) ||
      s.items.some(item => item.description.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Helper functions
const getStatusStyle = (status: string) => {
  const styles = {
    paid: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    outstanding: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
    overdue: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
  }
  return styles[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
}

const getStatusIcon = (status: string) => {
  const icons = {
    paid: CheckCircle,
    outstanding: Clock,
    overdue: AlertCircle
  }
  return icons[status] || XCircle
}

const getStatusText = (status: string) => {
  const texts = {
    paid: language.value === 'de' ? 'Bezahlt' : 'Paid',
    outstanding: language.value === 'de' ? 'Ausstehend' : 'Outstanding',
    overdue: language.value === 'de' ? 'Überfällig' : 'Overdue'
  }
  return texts[status] || status
}

// Action functions
const downloadStatement = (statement: any) => {
  console.log('Downloading statement:', statement.invoiceNumber)
  // Implementation for downloading PDF
}

const makePayment = (statement: any) => {
  console.log('Making payment for:', statement.invoiceNumber)
  // Implementation for payment processing
}

const viewDetails = (statement: any) => {
  console.log('Viewing details for:', statement.invoiceNumber)
  // Implementation for viewing detailed statement
}

const requestExtension = (statement: any) => {
  console.log('Requesting extension for:', statement.invoiceNumber)
  // Implementation for requesting payment extension
}
</script> 