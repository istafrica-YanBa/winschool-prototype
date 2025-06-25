<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <BookOpen class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Bibliotheksmodul' : 'Library Module' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Vereinfachte Buchausleihe mit Ein- und Auscheckfunktionen' : 'Simplified book lending with check-in and check-out functions' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showLendBook = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <LogOut class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Buch ausleihen' : 'Check Out Book' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in libraryStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
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
            <option value="Checked Out">{{ language === 'de' ? 'Ausgeliehen' : 'Checked Out' }}</option>
            <option value="Overdue">{{ language === 'de' ? 'Überfällig' : 'Overdue' }}</option>
            <option value="Returned">{{ language === 'de' ? 'Zurückgegeben' : 'Returned' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Fälligkeitszeitraum' : 'Due Period' }}
          </label>
          <select v-model="filters.duePeriod" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Zeiträume' : 'All Periods' }}</option>
            <option value="today">{{ language === 'de' ? 'Heute fällig' : 'Due Today' }}</option>
            <option value="week">{{ language === 'de' ? 'Diese Woche fällig' : 'Due This Week' }}</option>
            <option value="overdue">{{ language === 'de' ? 'Überfällig' : 'Overdue' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Benutzertyp' : 'User Type' }}
          </label>
          <select v-model="filters.userType" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
            <option value="Student">{{ language === 'de' ? 'Schüler' : 'Student' }}</option>
            <option value="Teacher">{{ language === 'de' ? 'Lehrer' : 'Teacher' }}</option>
            <option value="Staff">{{ language === 'de' ? 'Personal' : 'Staff' }}</option>
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
          :placeholder="language === 'de' ? 'Nach Büchern oder Benutzern suchen...' : 'Search books or users...'"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Library Transactions Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Bibliothekstransaktionen' : 'Library Transactions' }}
        </h2>
        
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Buch' : 'Book' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Benutzer' : 'User' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Ausgeliehen am' : 'Checked Out' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Fällig am' : 'Due Date' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Status' : 'Status' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ transaction.bookTitle }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ transaction.isbn }}</div>
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ transaction.userName }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ transaction.userType }}</div>
                </td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ formatDate(transaction.checkOutDate) }}</td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ formatDate(transaction.dueDate) }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(transaction.status)">
                    {{ language === 'de' ? getStatusTranslation(transaction.status) : transaction.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button v-if="transaction.status === 'Checked Out'" @click="checkInBook(transaction)" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" :title="language === 'de' ? 'Einchecken' : 'Check In'">
                      <CheckCircle class="h-4 w-4" />
                    </button>
                    <button v-if="transaction.status === 'Checked Out'" @click="renewLoan(transaction)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" :title="language === 'de' ? 'Verlängern' : 'Renew'">
                      <RotateCcw class="h-4 w-4" />
                    </button>
                    <button @click="viewTransactionDetails(transaction)" class="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300" :title="language === 'de' ? 'Details anzeigen' : 'View Details'">
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
          <div v-for="transaction in filteredTransactions" :key="transaction.id" class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-medium text-slate-800 dark:text-slate-200">{{ transaction.bookTitle }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ transaction.isbn }}</p>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(transaction.status)">
                {{ language === 'de' ? getStatusTranslation(transaction.status) : transaction.status }}
              </span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Benutzer:' : 'User:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ transaction.userName }} ({{ transaction.userType }})</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Fällig am:' : 'Due Date:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ formatDate(transaction.dueDate) }}</span>
              </div>
              <div class="flex justify-end space-x-2 mt-3">
                <button v-if="transaction.status === 'Checked Out'" @click="checkInBook(transaction)" class="p-2 bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800 rounded-lg">
                  <CheckCircle class="h-4 w-4" />
                </button>
                <button v-if="transaction.status === 'Checked Out'" @click="renewLoan(transaction)" class="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800 rounded-lg">
                  <RotateCcw class="h-4 w-4" />
                </button>
                <button @click="viewTransactionDetails(transaction)" class="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg">
                  <Eye class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lend Book Modal -->
    <div v-if="showLendBook" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Buch ausleihen' : 'Lend Book' }}
            </h3>
            <button @click="showLendBook = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="submitLendBook" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Buch auswählen' : 'Select Book' }}
              </label>
              <select v-model="newLending.bookId" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Buch auswählen...' : 'Select a book...' }}</option>
                <option v-for="book in availableBooks" :key="book.id" :value="book.id">
                  {{ book.title }} ({{ book.isbn }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Benutzer auswählen' : 'Select User' }}
              </label>
              <select v-model="newLending.userId" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Benutzer auswählen...' : 'Select a user...' }}</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.type }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Fälligkeitsdatum' : 'Due Date' }}
              </label>
              <input
                v-model="newLending.dueDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showLendBook = false"
                class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-medium rounded-lg"
              >
                {{ language === 'de' ? 'Ausleihen' : 'Lend Book' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import {
  Library,
  ChevronRight,
  Filter,
  Plus,
  Search,
  BookOpen,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Eye,
  X,
  BarChart3,
  LogOut
} from 'lucide-vue-next'

const languageStore = useLanguageStore()
const language = computed(() => languageStore.language)

// Reactive data
const showFilters = ref(false)
const showLendBook = ref(false)
const searchQuery = ref('')

const filters = ref({
  status: '',
  duePeriod: '',
  userType: ''
})

const newLending = ref({
  bookId: '',
  userId: '',
  dueDate: ''
})

// Mock data
const libraryTransactions = ref([
  {
    id: 1,
    bookId: 'B001',
    bookTitle: 'Advanced Mathematics',
    isbn: '978-0123456789',
    userId: 'U001',
    userName: 'John Smith',
    userType: 'Student',
    checkOutDate: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'Checked Out'
  },
  {
    id: 2,
    bookId: 'B002',
    bookTitle: 'Physics Fundamentals',
    isbn: '978-0987654321',
    userId: 'U002',
    userName: 'Sarah Johnson',
    userType: 'Teacher',
    checkOutDate: '2024-01-10',
    dueDate: '2024-01-25',
    status: 'Overdue'
  },
  {
    id: 3,
    bookId: 'B003',
    bookTitle: 'Chemistry Lab Manual',
    isbn: '978-0456789123',
    userId: 'U003',
    userName: 'Mike Davis',
    userType: 'Student',
    checkOutDate: '2024-01-20',
    dueDate: '2024-02-20',
    status: 'Checked Out'
  },
  {
    id: 4,
    bookId: 'B004',
    bookTitle: 'English Literature',
    isbn: '978-0789123456',
    userId: 'U004',
    userName: 'Emma Wilson',
    userType: 'Student',
    checkOutDate: '2024-01-01',
    dueDate: '2024-01-31',
    status: 'Returned'
  }
])

const availableBooks = ref([
  { id: 'B005', title: 'Biology Textbook', isbn: '978-0123789456' },
  { id: 'B006', title: 'World History', isbn: '978-0456123789' },
  { id: 'B007', title: 'Computer Science Basics', isbn: '978-0789456123' }
])

const users = ref([
  { id: 'U005', name: 'Alex Brown', type: 'Student' },
  { id: 'U006', name: 'Lisa Garcia', type: 'Teacher' },
  { id: 'U007', name: 'Tom Anderson', type: 'Staff' }
])

// Computed properties
const libraryStats = computed(() => [
  {
    title: language.value === 'de' ? 'Aktive Ausleihen' : 'Active Loans',
    value: libraryTransactions.value.filter(t => t.status === 'Checked Out').length.toString(),
    change: language.value === 'de' ? '+3 diese Woche' : '+3 this week',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: BookOpen,
    iconBg: 'bg-blue-500'
  },
  {
    title: language.value === 'de' ? 'Überfällige Bücher' : 'Overdue Books',
    value: libraryTransactions.value.filter(t => t.status === 'Overdue').length.toString(),
    change: language.value === 'de' ? '-1 seit gestern' : '-1 since yesterday',
    changeColor: 'text-red-600 dark:text-red-400',
    icon: AlertTriangle,
    iconBg: 'bg-red-500'
  },
  {
    title: language.value === 'de' ? 'Aktive Benutzer' : 'Active Users',
    value: new Set(libraryTransactions.value.filter(t => t.status === 'Checked Out').map(t => t.userId)).size.toString(),
    change: language.value === 'de' ? '+2 neue Nutzer' : '+2 new users',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: Users,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Heute fällig' : 'Due Today',
    value: '2',
    change: language.value === 'de' ? 'Erinnerungen gesendet' : 'Reminders sent',
    changeColor: 'text-yellow-600 dark:text-yellow-400',
    icon: Clock,
    iconBg: 'bg-yellow-500'
  }
])

const filteredTransactions = computed(() => {
  let transactions = libraryTransactions.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    transactions = transactions.filter(
      t => t.bookTitle.toLowerCase().includes(query) ||
           t.userName.toLowerCase().includes(query) ||
           t.isbn.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (filters.value.status) {
    transactions = transactions.filter(t => t.status === filters.value.status)
  }

  // Apply due period filter
  if (filters.value.duePeriod) {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    transactions = transactions.filter(t => {
      switch (filters.value.duePeriod) {
        case 'today':
          return t.dueDate === todayStr
        case 'week':
          return t.dueDate <= weekFromNow && t.dueDate >= todayStr
        case 'overdue':
          return t.dueDate < todayStr && t.status === 'Checked Out'
        default:
          return true
      }
    })
  }

  // Apply user type filter
  if (filters.value.userType) {
    transactions = transactions.filter(t => t.userType === filters.value.userType)
  }

  return transactions
})

// Methods
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Checked Out':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'Overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'Returned':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getStatusTranslation = (status: string) => {
  const translations: { [key: string]: string } = {
    'Checked Out': 'Ausgeliehen',
    'Overdue': 'Überfällig',
    'Returned': 'Zurückgegeben'
  }
  return translations[status] || status
}

const checkInBook = (transaction: any) => {
  transaction.status = 'Returned'
  transaction.returnDate = new Date().toISOString().split('T')[0]
  // In a real app, this would make an API call
}

const renewLoan = (transaction: any) => {
  const currentDueDate = new Date(transaction.dueDate)
  const newDueDate = new Date(currentDueDate.getTime() + 14 * 24 * 60 * 60 * 1000) // Add 2 weeks
  transaction.dueDate = newDueDate.toISOString().split('T')[0]
  // In a real app, this would make an API call
}

const viewTransactionDetails = (transaction: any) => {
  // In a real app, this would show detailed transaction information
  console.log('View transaction details:', transaction)
}

const submitLendBook = () => {
  const selectedBook = availableBooks.value.find(b => b.id === newLending.value.bookId)
  const selectedUser = users.value.find(u => u.id === newLending.value.userId)
  
  if (selectedBook && selectedUser) {
    const newTransaction = {
      id: Date.now(),
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      isbn: selectedBook.isbn,
      userId: selectedUser.id,
      userName: selectedUser.name,
      userType: selectedUser.type,
      checkOutDate: new Date().toISOString().split('T')[0],
      dueDate: newLending.value.dueDate,
      status: 'Checked Out'
    }
    
    libraryTransactions.value.unshift(newTransaction)
    
    // Remove book from available books
    availableBooks.value = availableBooks.value.filter(b => b.id !== selectedBook.id)
    
    // Reset form
    newLending.value = {
      bookId: '',
      userId: '',
      dueDate: ''
    }
    
    showLendBook.value = false
  }
}

onMounted(() => {
  // Set default due date to 2 weeks from now
  const defaultDueDate = new Date()
  defaultDueDate.setDate(defaultDueDate.getDate() + 14)
  newLending.value.dueDate = defaultDueDate.toISOString().split('T')[0]
})
</script> 