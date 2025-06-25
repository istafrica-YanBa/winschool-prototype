<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Calendar class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Buchausleihe' : 'Book Lending' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie die Buchausleihe an Schüler und Mitarbeiter' : 'Manage book lending to students and staff members' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showNewLending = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Neue Ausleihe' : 'New Lending' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in lendingStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Status' : 'Status' }}
          </label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="Active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
            <option value="Returned">{{ language === 'de' ? 'Zurückgegeben' : 'Returned' }}</option>
            <option value="Overdue">{{ language === 'de' ? 'Überfällig' : 'Overdue' }}</option>
            <option value="Lost">{{ language === 'de' ? 'Verloren' : 'Lost' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Ausleihertyp' : 'Borrower Type' }}
          </label>
          <select v-model="filters.borrowerType" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
            <option value="Student">{{ language === 'de' ? 'Schüler' : 'Student' }}</option>
            <option value="Teacher">{{ language === 'de' ? 'Lehrer' : 'Teacher' }}</option>
            <option value="Staff">{{ language === 'de' ? 'Personal' : 'Staff' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Fälligkeitsdatum' : 'Due Date' }}
          </label>
          <select v-model="filters.dueDate" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Daten' : 'All Dates' }}</option>
            <option value="today">{{ language === 'de' ? 'Heute fällig' : 'Due Today' }}</option>
            <option value="week">{{ language === 'de' ? 'Diese Woche' : 'This Week' }}</option>
            <option value="overdue">{{ language === 'de' ? 'Überfällig' : 'Overdue' }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="language === 'de' ? 'Ausleihen suchen (Ausleiher, Buch, ISBN)...' : 'Search lendings (borrower, book, ISBN)...'"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Lending Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Aktive Ausleihen' : 'Active Lendings' }}
        </h2>
        
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Ausleiher' : 'Borrower' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Buch' : 'Book' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Ausgeliehen am' : 'Lent Date' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Fällig am' : 'Due Date' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Status' : 'Status' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lending in filteredLendings" :key="lending.id" class="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ lending.borrowerName }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ lending.borrowerType }} - {{ lending.borrowerId }}</div>
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ lending.bookTitle }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ lending.bookAuthor }}</div>
                </td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ formatDate(lending.lentDate) }}</td>
                <td class="py-3 px-4">
                  <div class="text-slate-700 dark:text-slate-300">{{ formatDate(lending.dueDate) }}</div>
                  <div class="text-xs" :class="getDueDateColor(lending.dueDate, lending.status)">
                    {{ getDaysUntilDue(lending.dueDate) }}
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(lending.status)">
                    {{ language === 'de' ? getStatusTranslation(lending.status) : lending.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="returnBook(lending)" v-if="lending.status === 'Active'" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                      <CheckCircle class="h-4 w-4" />
                    </button>
                    <button @click="renewLending(lending)" v-if="lending.status === 'Active'" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <RotateCcw class="h-4 w-4" />
                    </button>
                    <button @click="editLending(lending)" class="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="viewDetails(lending)" class="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                      <Eye class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <div v-for="lending in filteredLendings" :key="lending.id" class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-medium text-slate-800 dark:text-slate-200">{{ lending.borrowerName }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ lending.borrowerType }}</p>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(lending.status)">
                {{ language === 'de' ? getStatusTranslation(lending.status) : lending.status }}
              </span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Buch:' : 'Book:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ lending.bookTitle }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Fällig:' : 'Due:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ formatDate(lending.dueDate) }}</span>
              </div>
              <div class="flex justify-end space-x-2 mt-3">
                <button @click="returnBook(lending)" v-if="lending.status === 'Active'" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                  <CheckCircle class="h-4 w-4" />
                </button>
                <button @click="renewLending(lending)" v-if="lending.status === 'Active'" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <RotateCcw class="h-4 w-4" />
                </button>
                <button @click="editLending(lending)" class="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="viewDetails(lending)" class="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                  <Eye class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lend Book Modal -->
    <div v-if="showNewLending || editingLending" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-2xl">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
          {{ editingLending ? (language === 'de' ? 'Ausleihe bearbeiten' : 'Edit Lending') : (language === 'de' ? 'Buch ausleihen' : 'Lend Book') }}
        </h3>
        <form @submit.prevent="saveLending" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Ausleiher Name' : 'Borrower Name' }}
              </label>
              <input
                v-model="lendingForm.borrowerName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Ausleiher ID' : 'Borrower ID' }}
              </label>
              <input
                v-model="lendingForm.borrowerId"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Ausleihertyp' : 'Borrower Type' }}
            </label>
            <select
              v-model="lendingForm.borrowerType"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="">{{ language === 'de' ? 'Typ auswählen' : 'Select Type' }}</option>
              <option value="Student">{{ language === 'de' ? 'Schüler' : 'Student' }}</option>
              <option value="Teacher">{{ language === 'de' ? 'Lehrer' : 'Teacher' }}</option>
              <option value="Staff">{{ language === 'de' ? 'Personal' : 'Staff' }}</option>
            </select>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Buchtitel' : 'Book Title' }}
              </label>
              <input
                v-model="lendingForm.bookTitle"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Autor' : 'Author' }}
              </label>
              <input
                v-model="lendingForm.bookAuthor"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Ausgeliehen am' : 'Lent Date' }}
              </label>
              <input
                v-model="lendingForm.lentDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Fällig am' : 'Due Date' }}
              </label>
              <input
                v-model="lendingForm.dueDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Bemerkungen' : 'Remarks' }}
            </label>
            <textarea
              v-model="lendingForm.remarks"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            ></textarea>
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {{ editingLending ? (language === 'de' ? 'Aktualisieren' : 'Update') : (language === 'de' ? 'Ausleihen' : 'Lend') }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { useAuthStore } from '../../stores/auth'
import { 
  Calendar, Plus, Filter, Search, Edit, Eye, ChevronRight,
  CheckCircle, RotateCcw, Clock, AlertTriangle, Users, BookOpen
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const language = computed(() => themeStore.language)

// State
const showFilters = ref(false)
const showNewLending = ref(false)
const editingLending = ref<any>(null)
const searchQuery = ref('')

// Filters
const filters = ref({
  status: '',
  borrowerType: '',
  dueDate: ''
})

// Form data
const lendingForm = ref({
  borrowerName: '',
  borrowerId: '',
  borrowerType: '',
  bookTitle: '',
  bookAuthor: '',
  lentDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  remarks: '',
  status: 'Active'
})

// Mock data
const lendings = ref([
  {
    id: 1,
    borrowerName: 'Emma Schmidt',
    borrowerId: 'S2024001',
    borrowerType: 'Student',
    bookTitle: 'Advanced Mathematics for Engineering',
    bookAuthor: 'Dr. Sarah Johnson',
    lentDate: '2024-01-15',
    dueDate: '2024-02-15',
    returnDate: null,
    status: 'Active',
    remarks: 'First time borrower'
  },
  {
    id: 2,
    borrowerName: 'Prof. Michael Chen',
    borrowerId: 'T2024005',
    borrowerType: 'Teacher',
    bookTitle: 'World History: A Global Perspective',
    bookAuthor: 'Dr. Emily Rodriguez',
    lentDate: '2024-01-10',
    dueDate: '2024-01-25',
    returnDate: null,
    status: 'Overdue',
    remarks: 'Research purpose'
  },
  {
    id: 3,
    borrowerName: 'Lisa Weber',
    borrowerId: 'S2024045',
    borrowerType: 'Student',
    bookTitle: 'Introduction to Chemistry',
    bookAuthor: 'Prof. Michael Chen',
    lentDate: '2024-01-12',
    dueDate: '2024-02-12',
    returnDate: '2024-01-20',
    status: 'Returned',
    remarks: 'Good condition on return'
  },
  {
    id: 4,
    borrowerName: 'Dr. Anna Müller',
    borrowerId: 'ST2024003',
    borrowerType: 'Staff',
    bookTitle: 'Shakespeare Complete Works',
    bookAuthor: 'William Shakespeare',
    lentDate: '2024-01-18',
    dueDate: '2024-02-18',
    returnDate: null,
    status: 'Active',
    remarks: 'Administrative reference'
  }
])

// Stats
const lendingStats = computed(() => [
  {
    title: language.value === 'de' ? 'Aktive Ausleihen' : 'Active Lendings',
    value: lendings.value.filter(l => l.status === 'Active').length.toString(),
    change: '+8 this week',
    changeColor: 'text-blue-500',
    icon: BookOpen,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Überfällig' : 'Overdue',
    value: lendings.value.filter(l => l.status === 'Overdue').length.toString(),
    change: 'Needs attention',
    changeColor: 'text-red-500',
    icon: AlertTriangle,
    iconBg: 'bg-red-600'
  },
  {
    title: language.value === 'de' ? 'Heute fällig' : 'Due Today',
    value: '3',
    change: 'Send reminders',
    changeColor: 'text-yellow-500',
    icon: Clock,
    iconBg: 'bg-yellow-600'
  },
  {
    title: language.value === 'de' ? 'Aktive Nutzer' : 'Active Borrowers',
    value: new Set(lendings.value.filter(l => l.status === 'Active').map(l => l.borrowerId)).size.toString(),
    change: 'Unique borrowers',
    changeColor: 'text-green-500',
    icon: Users,
    iconBg: 'bg-green-600'
  }
])

// Computed
const filteredLendings = computed(() => {
  return lendings.value.filter(lending => {
    const matchesSearch = lending.borrowerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         lending.bookTitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         lending.borrowerId.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filters.value.status || lending.status === filters.value.status
    const matchesBorrowerType = !filters.value.borrowerType || lending.borrowerType === filters.value.borrowerType
    
    let matchesDueDate = true
    if (filters.value.dueDate) {
      const today = new Date()
      const dueDate = new Date(lending.dueDate)
      
      if (filters.value.dueDate === 'today') {
        matchesDueDate = dueDate.toDateString() === today.toDateString()
      } else if (filters.value.dueDate === 'week') {
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        matchesDueDate = dueDate <= weekFromNow && dueDate >= today
      } else if (filters.value.dueDate === 'overdue') {
        matchesDueDate = dueDate < today && lending.status !== 'Returned'
      }
    }
    
    return matchesSearch && matchesStatus && matchesBorrowerType && matchesDueDate
  })
})

// Methods
const getStatusColor = (status: string) => {
  const colors = {
    'Active': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Returned': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Overdue': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    'Lost': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const getDueDateColor = (dueDate: string, status: string) => {
  if (status === 'Returned') return 'text-green-500'
  
  const today = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-500'
  if (diffDays <= 3) return 'text-yellow-500'
  return 'text-green-500'
}

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return language.value === 'de' ? `${Math.abs(diffDays)} Tage überfällig` : `${Math.abs(diffDays)} days overdue`
  } else if (diffDays === 0) {
    return language.value === 'de' ? 'Heute fällig' : 'Due today'
  } else {
    return language.value === 'de' ? `In ${diffDays} Tagen fällig` : `Due in ${diffDays} days`
  }
}

const getStatusTranslation = (status: string) => {
  const translations = {
    'Active': 'Aktiv',
    'Returned': 'Zurückgegeben',
    'Overdue': 'Überfällig',
    'Lost': 'Verloren'
  }
  return translations[status as keyof typeof translations] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const returnBook = (lending: any) => {
  lending.status = 'Returned'
  lending.returnDate = new Date().toISOString().split('T')[0]
}

const renewLending = (lending: any) => {
  const currentDue = new Date(lending.dueDate)
  currentDue.setDate(currentDue.getDate() + 14) // Extend by 2 weeks
  lending.dueDate = currentDue.toISOString().split('T')[0]
}

const editLending = (lending: any) => {
  editingLending.value = lending
  lendingForm.value = { ...lending }
  showNewLending.value = true
}

const viewDetails = (lending: any) => {
  alert(`${language.value === 'de' ? 'Ausleihdetails für' : 'Lending details for'}: ${lending.bookTitle} - ${lending.borrowerName}`)
}

const saveLending = () => {
  if (editingLending.value) {
    // Update existing lending
    const index = lendings.value.findIndex(lending => lending.id === editingLending.value.id)
    if (index !== -1) {
      lendings.value[index] = { ...lendingForm.value, id: editingLending.value.id }
    }
  } else {
    // Add new lending
    const newLending = {
      ...lendingForm.value,
      id: Math.max(...lendings.value.map(lending => lending.id)) + 1,
      returnDate: null
    }
    lendings.value.push(newLending)
  }
  cancelEdit()
}

const cancelEdit = () => {
  showNewLending.value = false
  editingLending.value = null
  lendingForm.value = {
    borrowerName: '',
    borrowerId: '',
    borrowerType: '',
    bookTitle: '',
    bookAuthor: '',
    lentDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    remarks: '',
    status: 'Active'
  }
}
</script> 