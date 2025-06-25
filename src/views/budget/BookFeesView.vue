<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <DollarSign class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Buchgebühren' : 'Book Fees' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Verwalten Sie Strafen für verlorene oder beschädigte Bücher' : 'Manage penalties for lost or damaged books' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showAddFee = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Gebühr hinzufügen' : 'Add Fee' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in feeStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
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
            {{ language === 'de' ? 'Typ' : 'Type' }}
          </label>
          <select v-model="filters.type" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
            <option value="Late Return">{{ language === 'de' ? 'Verspätete Rückgabe' : 'Late Return' }}</option>
            <option value="Lost Book">{{ language === 'de' ? 'Verlorenes Buch' : 'Lost Book' }}</option>
            <option value="Damaged Book">{{ language === 'de' ? 'Beschädigtes Buch' : 'Damaged Book' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Status' : 'Status' }}
          </label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="Pending">{{ language === 'de' ? 'Ausstehend' : 'Pending' }}</option>
            <option value="Paid">{{ language === 'de' ? 'Bezahlt' : 'Paid' }}</option>
            <option value="Waived">{{ language === 'de' ? 'Erlassen' : 'Waived' }}</option>
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
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Betrag' : 'Amount' }}
          </label>
          <select v-model="filters.amountRange" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Beträge' : 'All Amounts' }}</option>
            <option value="0-10">€0 - €10</option>
            <option value="10-50">€10 - €50</option>
            <option value="50+">€50+</option>
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

    <!-- Book Fees Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Buchgebühren' : 'Book Fees' }}
        </h2>
        
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Benutzer' : 'User' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Buch' : 'Book' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Typ' : 'Type' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Betrag' : 'Amount' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Datum' : 'Date' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Status' : 'Status' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fee in filteredFees" :key="fee.id" class="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ fee.userName }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ fee.userType }}</div>
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ fee.bookTitle }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ fee.isbn }}</div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getTypeColor(fee.type)">
                    {{ language === 'de' ? getTypeTranslation(fee.type) : fee.type }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="font-medium text-slate-800 dark:text-slate-200">€{{ fee.amount.toFixed(2) }}</span>
                </td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ formatDate(fee.date) }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(fee.status)">
                    {{ language === 'de' ? getStatusTranslation(fee.status) : fee.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button v-if="fee.status === 'Pending'" @click="markAsPaid(fee)" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" :title="language === 'de' ? 'Als bezahlt markieren' : 'Mark as Paid'">
                      <CheckCircle class="h-4 w-4" />
                    </button>
                    <button v-if="fee.status === 'Pending'" @click="waiveFee(fee)" class="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300" :title="language === 'de' ? 'Gebühr erlassen' : 'Waive Fee'">
                      <XCircle class="h-4 w-4" />
                    </button>
                    <button @click="editFee(fee)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" :title="language === 'de' ? 'Bearbeiten' : 'Edit'">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="viewFeeDetails(fee)" class="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300" :title="language === 'de' ? 'Details anzeigen' : 'View Details'">
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
          <div v-for="fee in filteredFees" :key="fee.id" class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-medium text-slate-800 dark:text-slate-200">{{ fee.userName }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ fee.userType }}</p>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(fee.status)">
                {{ language === 'de' ? getStatusTranslation(fee.status) : fee.status }}
              </span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Buch:' : 'Book:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ fee.bookTitle }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Typ:' : 'Type:' }}</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getTypeColor(fee.type)">
                  {{ language === 'de' ? getTypeTranslation(fee.type) : fee.type }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Betrag:' : 'Amount:' }}</span>
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">€{{ fee.amount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-end space-x-2 mt-3">
                <button v-if="fee.status === 'Pending'" @click="markAsPaid(fee)" class="p-2 bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800 rounded-lg">
                  <CheckCircle class="h-4 w-4" />
                </button>
                <button v-if="fee.status === 'Pending'" @click="waiveFee(fee)" class="p-2 bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-400 dark:hover:bg-yellow-800 rounded-lg">
                  <XCircle class="h-4 w-4" />
                </button>
                <button @click="editFee(fee)" class="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800 rounded-lg">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="viewFeeDetails(fee)" class="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg">
                  <Eye class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Fee Modal -->
    <div v-if="showAddFee || editingFee" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ editingFee ? (language === 'de' ? 'Gebühr bearbeiten' : 'Edit Fee') : (language === 'de' ? 'Gebühr hinzufügen' : 'Add Fee') }}
            </h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="submitFee" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Benutzer auswählen' : 'Select User' }}
              </label>
              <select v-model="currentFee.userId" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Benutzer auswählen...' : 'Select a user...' }}</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.type }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Buch auswählen' : 'Select Book' }}
              </label>
              <select v-model="currentFee.bookId" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Buch auswählen...' : 'Select a book...' }}</option>
                <option v-for="book in allBooks" :key="book.id" :value="book.id">
                  {{ book.title }} ({{ book.isbn }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Gebührentyp' : 'Fee Type' }}
              </label>
              <select v-model="currentFee.type" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Typ auswählen...' : 'Select type...' }}</option>
                <option value="Late Return">{{ language === 'de' ? 'Verspätete Rückgabe' : 'Late Return' }}</option>
                <option value="Lost Book">{{ language === 'de' ? 'Verlorenes Buch' : 'Lost Book' }}</option>
                <option value="Damaged Book">{{ language === 'de' ? 'Beschädigtes Buch' : 'Damaged Book' }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Betrag (€)' : 'Amount (€)' }}
              </label>
              <input
                v-model.number="currentFee.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea
                v-model="currentFee.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                :placeholder="language === 'de' ? 'Zusätzliche Details...' : 'Additional details...'"
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-medium rounded-lg"
              >
                {{ editingFee ? (language === 'de' ? 'Aktualisieren' : 'Update') : (language === 'de' ? 'Hinzufügen' : 'Add') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import {
  DollarSign,
  ChevronRight,
  Filter,
  Plus,
  Search,
  TrendingUp,
  AlertTriangle,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  X
} from 'lucide-vue-next'

const languageStore = useLanguageStore()
const language = computed(() => languageStore.language)

// Reactive data
const showFilters = ref(false)
const showAddFee = ref(false)
const editingFee = ref(null)
const searchQuery = ref('')

const filters = ref({
  type: '',
  status: '',
  userType: '',
  amountRange: ''
})

const currentFee = ref({
  userId: '',
  bookId: '',
  type: '',
  amount: 0,
  description: '',
  status: 'Pending'
})

// Mock data
const bookFees = ref([
  {
    id: 1,
    userId: 'U001',
    userName: 'John Smith',
    userType: 'Student',
    bookId: 'B001',
    bookTitle: 'Advanced Mathematics',
    isbn: '978-0123456789',
    type: 'Late Return',
    amount: 5.50,
    date: '2024-01-20',
    status: 'Pending',
    description: '5 days overdue'
  },
  {
    id: 2,
    userId: 'U002',
    userName: 'Sarah Johnson',
    userType: 'Teacher',
    bookId: 'B002',
    bookTitle: 'Physics Fundamentals',
    isbn: '978-0987654321',
    type: 'Lost Book',
    amount: 45.00,
    date: '2024-01-18',
    status: 'Paid',
    description: 'Book reported lost'
  },
  {
    id: 3,
    userId: 'U003',
    userName: 'Mike Davis',
    userType: 'Student',
    bookId: 'B003',
    bookTitle: 'Chemistry Lab Manual',
    isbn: '978-0456789123',
    type: 'Damaged Book',
    amount: 25.00,
    date: '2024-01-22',
    status: 'Pending',
    description: 'Water damage to cover'
  },
  {
    id: 4,
    userId: 'U004',
    userName: 'Emma Wilson',
    userType: 'Student',
    bookId: 'B004',
    bookTitle: 'English Literature',
    isbn: '978-0789123456',
    type: 'Late Return',
    amount: 2.00,
    date: '2024-01-15',
    status: 'Waived',
    description: '2 days overdue - first offense'
  }
])

const users = ref([
  { id: 'U005', name: 'Alex Brown', type: 'Student' },
  { id: 'U006', name: 'Lisa Garcia', type: 'Teacher' },
  { id: 'U007', name: 'Tom Anderson', type: 'Staff' }
])

const allBooks = ref([
  { id: 'B005', title: 'Biology Textbook', isbn: '978-0123789456' },
  { id: 'B006', title: 'World History', isbn: '978-0456123789' },
  { id: 'B007', title: 'Computer Science Basics', isbn: '978-0789456123' }
])

// Computed properties
const feeStats = computed(() => [
  {
    title: language.value === 'de' ? 'Gesamteinnahmen' : 'Total Revenue',
    value: `€${bookFees.value.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0).toFixed(2)}`,
    change: language.value === 'de' ? '+€15 diese Woche' : '+€15 this week',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: TrendingUp,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Ausstehende Gebühren' : 'Pending Fees',
    value: bookFees.value.filter(f => f.status === 'Pending').length.toString(),
    change: language.value === 'de' ? '+2 neue Gebühren' : '+2 new fees',
    changeColor: 'text-yellow-600 dark:text-yellow-400',
    icon: AlertTriangle,
    iconBg: 'bg-yellow-500'
  },
  {
    title: language.value === 'de' ? 'Betroffene Benutzer' : 'Affected Users',
    value: new Set(bookFees.value.map(f => f.userId)).size.toString(),
    change: language.value === 'de' ? '3 aktive Fälle' : '3 active cases',
    changeColor: 'text-blue-600 dark:text-blue-400',
    icon: Users,
    iconBg: 'bg-blue-500'
  },
  {
    title: language.value === 'de' ? 'Durchschnittsgebühr' : 'Average Fee',
    value: `€${(bookFees.value.reduce((sum, f) => sum + f.amount, 0) / bookFees.value.length).toFixed(2)}`,
    change: language.value === 'de' ? 'Diesen Monat' : 'This month',
    changeColor: 'text-purple-600 dark:text-purple-400',
    icon: Calendar,
    iconBg: 'bg-purple-500'
  }
])

const filteredFees = computed(() => {
  let fees = bookFees.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    fees = fees.filter(
      f => f.userName.toLowerCase().includes(query) ||
           f.bookTitle.toLowerCase().includes(query) ||
           f.isbn.toLowerCase().includes(query)
    )
  }

  // Apply type filter
  if (filters.value.type) {
    fees = fees.filter(f => f.type === filters.value.type)
  }

  // Apply status filter
  if (filters.value.status) {
    fees = fees.filter(f => f.status === filters.value.status)
  }

  // Apply user type filter
  if (filters.value.userType) {
    fees = fees.filter(f => f.userType === filters.value.userType)
  }

  // Apply amount range filter
  if (filters.value.amountRange) {
    fees = fees.filter(f => {
      switch (filters.value.amountRange) {
        case '0-10':
          return f.amount >= 0 && f.amount <= 10
        case '10-50':
          return f.amount > 10 && f.amount <= 50
        case '50+':
          return f.amount > 50
        default:
          return true
      }
    })
  }

  return fees
})

// Methods
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Late Return':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'Lost Book':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'Damaged Book':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'Paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'Waived':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getTypeTranslation = (type: string) => {
  const translations: { [key: string]: string } = {
    'Late Return': 'Verspätete Rückgabe',
    'Lost Book': 'Verlorenes Buch',
    'Damaged Book': 'Beschädigtes Buch'
  }
  return translations[type] || type
}

const getStatusTranslation = (status: string) => {
  const translations: { [key: string]: string } = {
    'Pending': 'Ausstehend',
    'Paid': 'Bezahlt',
    'Waived': 'Erlassen'
  }
  return translations[status] || status
}

const markAsPaid = (fee: any) => {
  fee.status = 'Paid'
  fee.paidDate = new Date().toISOString().split('T')[0]
  // In a real app, this would make an API call
}

const waiveFee = (fee: any) => {
  fee.status = 'Waived'
  fee.waivedDate = new Date().toISOString().split('T')[0]
  // In a real app, this would make an API call
}

const editFee = (fee: any) => {
  editingFee.value = fee
  currentFee.value = { ...fee }
}

const viewFeeDetails = (fee: any) => {
  // In a real app, this would show detailed fee information
  console.log('View fee details:', fee)
}

const closeModal = () => {
  showAddFee.value = false
  editingFee.value = null
  currentFee.value = {
    userId: '',
    bookId: '',
    type: '',
    amount: 0,
    description: '',
    status: 'Pending'
  }
}

const submitFee = () => {
  const selectedUser = users.value.find(u => u.id === currentFee.value.userId)
  const selectedBook = allBooks.value.find(b => b.id === currentFee.value.bookId)
  
  if (selectedUser && selectedBook) {
    if (editingFee.value) {
      // Update existing fee
      const index = bookFees.value.findIndex(f => f.id === editingFee.value.id)
      if (index !== -1) {
        bookFees.value[index] = {
          ...bookFees.value[index],
          ...currentFee.value,
          userName: selectedUser.name,
          userType: selectedUser.type,
          bookTitle: selectedBook.title,
          isbn: selectedBook.isbn
        }
      }
    } else {
      // Add new fee
      const newFee = {
        id: Date.now(),
        ...currentFee.value,
        userName: selectedUser.name,
        userType: selectedUser.type,
        bookTitle: selectedBook.title,
        isbn: selectedBook.isbn,
        date: new Date().toISOString().split('T')[0]
      }
      
      bookFees.value.unshift(newFee)
    }
    
    closeModal()
  }
}
</script> 