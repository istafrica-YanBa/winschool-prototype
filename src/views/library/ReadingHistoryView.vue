<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import type { Book } from '@/types/library'
import { BookOpen, Calendar, Clock, Search, AlertCircle, CheckCircle, History, Plus } from 'lucide-vue-next'

const authStore = useAuthStore()
const { showToast } = useToast()

// Tab management
const activeTab = ref('history')

// Reading History Data
const readingHistory = ref([
  {
    id: 1,
    title: 'Advanced Mathematics',
    author: 'Dr. Schmidt',
    borrowDate: '2024-01-15',
    returnDate: '2024-02-15',
    status: 'returned'
  },
  {
    id: 2,
    title: 'Physics Fundamentals',
    author: 'Prof. Weber',
    borrowDate: '2024-02-20',
    returnDate: null,
    dueDate: '2024-03-20',
    status: 'borrowed'
  }
])

const myReservations = ref([
  {
    id: 1,
    title: 'Modern Chemistry',
    author: 'Dr. Klein',
    requestDate: '2024-03-10',
    preferredDate: '2024-03-25',
    status: 'pending'
  }
])

// Book Search & Reservation Data
const searchQuery = ref('')
const selectedCategory = ref('')
const isLoading = ref(false)

const mockBooks = ref([
  {
    id: 1,
    title: 'Advanced Mathematics',
    author: 'Dr. Schmidt',
    isbn: '978-3-16-148410-0',
    category: 'Mathematics',
    publisher: 'Academic Press',
    publishedYear: 2023,
    availableCopies: 3,
    totalCopies: 5
  },
  {
    id: 2,
    title: 'German Literature Classics',
    author: 'Prof. Mueller',
    isbn: '978-3-16-148411-7',
    category: 'Literature',
    publisher: 'Cultural Books',
    publishedYear: 2022,
    availableCopies: 0,
    totalCopies: 2
  }
])

const categories = ref(['Mathematics', 'Literature', 'Physics', 'Chemistry', 'History', 'Biology'])

// Reservation modal
const showReservationModal = ref(false)
const selectedBook = ref(null)
const reservationForm = ref({
  preferredDate: '',
  notes: ''
})

// Computed properties for statistics
const totalBooksRead = computed(() => readingHistory.value.filter(book => book.status === 'returned').length)
const currentlyBorrowed = computed(() => readingHistory.value.filter(book => book.status === 'borrowed').length)
const overdueBooks = computed(() => readingHistory.value.filter(book => book.status === 'overdue').length)

// Filtered books for search
const filteredBooks = computed(() => {
  let filtered = mockBooks.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query)
    )
  }
  
  if (selectedCategory.value) {
    filtered = filtered.filter(book => book.category === selectedCategory.value)
  }
  
  return filtered
})

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE')
}

const getStatusColor = (status) => {
  switch (status) {
    case 'returned': return 'text-green-600'
    case 'borrowed': return 'text-blue-600'
    case 'overdue': return 'text-red-600'
    case 'pending': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'returned': return 'Returned'
    case 'borrowed': return 'Currently Borrowed'
    case 'overdue': return 'Overdue'
    case 'pending': return 'Pending'
    default: return status
  }
}

const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Reservation functions
const openReservationModal = (book) => {
  selectedBook.value = book
  reservationForm.value = {
    preferredDate: '',
    notes: ''
  }
  showReservationModal.value = true
}

const submitReservation = async () => {
  if (!selectedBook.value) return
  
  try {
    const newReservation = {
      id: myReservations.value.length + 1,
      title: selectedBook.value.title,
      author: selectedBook.value.author,
      requestDate: new Date().toISOString().split('T')[0],
      preferredDate: reservationForm.value.preferredDate,
      status: 'pending'
    }
    
    myReservations.value.push(newReservation)
    showToast('Reservation submitted successfully!', 'success')
    showReservationModal.value = false
  } catch (error) {
    console.error('Error submitting reservation:', error)
    showToast('Failed to submit reservation', 'error')
  }
}

const getAvailabilityStatus = (book) => {
  if (book.availableCopies > 0) {
    return {
      status: 'available',
      text: `${book.availableCopies} available`,
      class: 'text-green-600'
    }
  } else if (book.totalCopies > 0) {
    return {
      status: 'unavailable',
      text: 'All copies borrowed',
      class: 'text-red-600'
    }
  } else {
    return {
      status: 'unavailable',
      text: 'Not available',
      class: 'text-gray-600'
    }
  }
}

onMounted(() => {
  isLoading.value = false
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-700 to-blue-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <BookOpen class="h-5 w-5 sm:h-7 sm:w-7 text-white" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              My Library
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              Manage your reading history and book reservations
            </p>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button 
            @click="activeTab = 'reservations'" 
            class="w-full sm:w-auto bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <Plus class="h-4 w-4 mr-2" />
            Make Reservation
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <button
              @click="activeTab = 'history'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'history'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              ]"
            >
              <History class="w-4 h-4 mr-2 inline" />
              Reading History
            </button>
            <button
              @click="activeTab = 'reservations'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'reservations'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              ]"
            >
              <Calendar class="w-4 h-4 mr-2 inline" />
              Make Reservation
            </button>
          </nav>
        </div>

        <!-- Reading History Tab -->
        <div v-if="activeTab === 'history'" class="p-6">
          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <BookOpen class="w-6 h-6 text-blue-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-blue-600 dark:text-blue-400">Books Read</p>
                  <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ totalBooksRead }}</p>
                </div>
              </div>
            </div>

            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                  <Calendar class="w-6 h-6 text-green-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-green-600 dark:text-green-400">Currently Borrowed</p>
                  <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ currentlyBorrowed }}</p>
                </div>
              </div>
            </div>

            <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div class="flex items-center">
                <div class="p-2 bg-red-100 dark:bg-red-800 rounded-lg">
                  <Clock class="w-6 h-6 text-red-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-red-600 dark:text-red-400">Overdue</p>
                  <p class="text-2xl font-bold text-red-900 dark:text-red-100">{{ overdueBooks }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Reading History Table -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading History</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Book</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Borrow Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due/Return Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="book in readingHistory" :key="book.id" class="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ book.title }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">by {{ book.author }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ formatDate(book.borrowDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div v-if="book.returnDate">
                        {{ formatDate(book.returnDate) }}
                      </div>
                      <div v-else-if="book.dueDate">
                        <div>Due: {{ formatDate(book.dueDate) }}</div>
                        <div v-if="getDaysUntilDue(book.dueDate) !== null" :class="[
                          'text-xs',
                          getDaysUntilDue(book.dueDate) < 0 ? 'text-red-600' : 
                          getDaysUntilDue(book.dueDate) <= 3 ? 'text-yellow-600' : 'text-green-600'
                        ]">
                          {{ getDaysUntilDue(book.dueDate) < 0 ? 
                            `${Math.abs(getDaysUntilDue(book.dueDate))} days overdue` :
                            `${getDaysUntilDue(book.dueDate)} days left`
                          }}
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[getStatusColor(book.status), 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700']">
                        {{ getStatusText(book.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Make Reservation Tab -->
        <div v-if="activeTab === 'reservations'" class="p-6">
          <!-- Search and Filters -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Search Input -->
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by title, author, or ISBN..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <!-- Category Filter -->
              <select
                v-model="selectedCategory"
                class="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              
              <!-- Search Button -->
              <button
                class="bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                :disabled="isLoading"
              >
                <Search class="w-4 h-4" />
                {{ isLoading ? 'Searching...' : 'Search Books' }}
              </button>
            </div>
          </div>

          <!-- Books List -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Books ({{ filteredBooks.length }})
            </h3>
            
            <div v-if="isLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p class="text-gray-600 dark:text-gray-400 mt-2">Loading books...</p>
            </div>
            
            <div v-else-if="filteredBooks.length === 0" class="text-center py-8">
              <BookOpen class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-600 dark:text-gray-400">
                {{ searchQuery ? 'No books found matching your search.' : 'No books available.' }}
              </p>
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="book in filteredBooks"
                :key="book.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-start gap-4">
                      <!-- Book Cover Placeholder -->
                      <div class="w-16 h-20 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded border flex items-center justify-center">
                        <BookOpen class="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <!-- Book Details -->
                      <div class="flex-1">
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {{ book.title }}
                        </h4>
                        <p class="text-gray-600 dark:text-gray-400 mb-2">
                          by {{ book.author }}
                        </p>
                        
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span class="text-gray-500 dark:text-gray-400">ISBN:</span>
                            <span class="ml-1 text-gray-900 dark:text-white">{{ book.isbn }}</span>
                          </div>
                          <div>
                            <span class="text-gray-500 dark:text-gray-400">Category:</span>
                            <span class="ml-1 text-gray-900 dark:text-white">{{ book.category }}</span>
                          </div>
                          <div>
                            <span class="text-gray-500 dark:text-gray-400">Publisher:</span>
                            <span class="ml-1 text-gray-900 dark:text-white">{{ book.publisher }}</span>
                          </div>
                          <div>
                            <span class="text-gray-500 dark:text-gray-400">Year:</span>
                            <span class="ml-1 text-gray-900 dark:text-white">{{ book.publishedYear }}</span>
                          </div>
                        </div>
                        
                        <!-- Availability Status -->
                        <div class="mt-3 flex items-center gap-2">
                          <CheckCircle v-if="getAvailabilityStatus(book).status === 'available'" class="w-4 h-4 text-green-600" />
                          <AlertCircle v-else class="w-4 h-4 text-red-600" />
                          <span :class="getAvailabilityStatus(book).class" class="text-sm font-medium">
                            {{ getAvailabilityStatus(book).text }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action Button -->
                  <div class="ml-4">
                    <button
                      @click="openReservationModal(book)"
                      :disabled="book.availableCopies === 0"
                      class="bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
                    >
                      <Calendar class="w-4 h-4" />
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reservation Modal -->
      <div v-if="showReservationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Reserve Book</h3>
              <button
                @click="showReservationModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div v-if="selectedBook" class="space-y-6">
              <!-- Book Info -->
              <div class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="w-12 h-16 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded border flex items-center justify-center">
                  <BookOpen class="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ selectedBook.title }}</h3>
                  <p class="text-gray-600 dark:text-gray-400">by {{ selectedBook.author }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">ISBN: {{ selectedBook.isbn }}</p>
                </div>
              </div>
              
              <!-- Reservation Form -->
              <form @submit.prevent="submitReservation" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Pickup Date
                  </label>
                  <input
                    v-model="reservationForm.preferredDate"
                    type="date"
                    :min="new Date().toISOString().split('T')[0]"
                    required
                    class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    v-model="reservationForm.notes"
                    rows="3"
                    class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Any special notes or requirements..."
                  ></textarea>
                </div>
                
                <!-- Modal Actions -->
                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    @click="showReservationModal = false"
                    class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <Calendar class="w-4 h-4" />
                    Submit Reservation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 