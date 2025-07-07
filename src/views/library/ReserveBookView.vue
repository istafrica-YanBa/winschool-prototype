<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { BookOpen, Search, Calendar } from 'lucide-vue-next'

// --- Domain Types (see autocoding/context/ and frontend patterns) ---
interface BookWithDetails {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publishedYear: number;
  availableCopies: number;
  totalCopies: number;
}

interface Reservation {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  isbn: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  reservationDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'fulfilled' | 'cancelled';
  notes?: string;
}

const { addToast } = useToast()

// Mock data for demonstration - replace with actual API calls
const searchQuery = ref('')
const selectedCategory = ref('')
const isLoading = ref(false)

const books = ref<BookWithDetails[]>([
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
  },
  {
    id: 3,
    title: 'Modern Physics Concepts',
    author: 'Dr. Weber',
    isbn: '978-3-16-148412-4',
    category: 'Physics',
    publisher: 'Science Publications',
    publishedYear: 2024,
    availableCopies: 1,
    totalCopies: 3
  }
])

const reservations = ref<Reservation[]>([])

const categories = ref(['Mathematics', 'Literature', 'Physics', 'Chemistry', 'History', 'Biology'])

// Reservation modal
const showReservationModal = ref(false)
const selectedBook = ref<BookWithDetails | null>(null)
const reservationForm = ref({
  preferredDate: '',
  notes: ''
})

// Filtered books based on search and category
const filteredBooks = computed(() => {
  let filtered = books.value
  
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

// Open reservation modal
const openReservationModal = (book: BookWithDetails) => {
  selectedBook.value = book
  reservationForm.value = {
    preferredDate: '',
    notes: ''
  }
  showReservationModal.value = true
}

// Submit reservation
const submitReservation = async () => {
  if (!selectedBook.value) return
  
  try {
    const newReservation: Reservation = {
      id: reservations.value.length + 1,
      bookId: selectedBook.value.id,
      bookTitle: selectedBook.value.title,
      bookAuthor: selectedBook.value.author,
      isbn: selectedBook.value.isbn,
      studentId: 'U001', // Mock student ID
      studentName: 'Current User',
      studentClass: '12A',
      reservationDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      notes: reservationForm.value.notes
    }
    
    reservations.value.push(newReservation)
    addToast({ message: 'Reservation submitted successfully!', type: 'success' })
    showReservationModal.value = false
  } catch (error) {
    console.error('Error submitting reservation:', error)
    addToast({ message: 'Failed to submit reservation', type: 'error' })
  }
}

// Get availability status
const getAvailabilityStatus = (book: BookWithDetails) => {
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
  // Load initial data
  isLoading.value = false
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen class="w-8 h-8 text-blue-600" />
          Reserve a Book
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Search for available books and submit reservation requests
        </p>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search Input -->
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title, author, or ISBN..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          class="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        
        <!-- Search Button -->
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          :disabled="isLoading"
        >
          <Search class="w-4 h-4" />
          {{ isLoading ? 'Searching...' : 'Search Books' }}
        </button>
      </div>
    </div>

    <!-- Books List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Available Books ({{ filteredBooks.length }})
        </h2>
      </div>
      
      <div v-if="isLoading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Loading books...</p>
      </div>
      
      <div v-else-if="filteredBooks.length === 0" class="p-6 text-center">
        <BookOpen class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">
          {{ searchQuery ? 'No books found matching your search.' : 'No books available.' }}
        </p>
      </div>
      
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="book in filteredBooks"
          :key="book.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
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
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {{ book.title }}
                  </h3>
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
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Calendar class="w-4 h-4" />
                Reserve
              </button>
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
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  v-model="reservationForm.notes"
                  rows="3"
                  class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
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
</template> 