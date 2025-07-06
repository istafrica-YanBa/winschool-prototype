<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { BookOpen, Search, Scan, Plus, Edit, Trash2, BarChart3, Users, CheckCircle, AlertCircle, Filter } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const { showToast } = useToast()
const router = useRouter()

// Reactive data
const books = ref([
  {
    id: 1,
    title: 'Advanced Mathematics',
    author: 'Dr. Schmidt',
    isbn: '978-3-16-148410-0',
    barcode: 'BRC001234567',
    signature: 'SCH24001',
    inventoryNumber: 'INV-2024-001',
    totalCopies: 5,
    availableCopies: 3,
    lentCopies: 2,
    category: 'Mathematics',
    publishedYear: 2023
  },
  {
    id: 2,
    title: 'German Literature Classics',
    author: 'Prof. Mueller',
    isbn: '978-3-16-148411-7',
    barcode: 'BRC001234568',
    signature: 'MUE24002',
    inventoryNumber: 'INV-2024-002',
    totalCopies: 3,
    availableCopies: 0,
    lentCopies: 3,
    category: 'Literature',
    publishedYear: 2022
  },
  {
    id: 3,
    title: 'Modern Physics Concepts',
    author: 'Dr. Weber',
    isbn: '978-3-16-148412-4',
    barcode: 'BRC001234569',
    signature: 'WEB24003',
    inventoryNumber: 'INV-2024-003',
    totalCopies: 4,
    availableCopies: 1,
    lentCopies: 3,
    category: 'Physics',
    publishedYear: 2024
  }
])

// UI State
const searchQuery = ref('')
const isLoading = ref(false)
const isMobile = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Form data
const newBook = ref({
  title: '',
  author: '',
  isbn: '',
  barcode: '',
  signature: '',
  inventoryNumber: '',
  totalCopies: 1,
  category: ''
})

// Computed properties for infographics
const totalBooks = computed(() => 
  books.value.reduce((sum, book) => sum + book.totalCopies, 0)
)

const totalLentBooks = computed(() => 
  books.value.reduce((sum, book) => sum + book.lentCopies, 0)
)

const totalAvailableBooks = computed(() => 
  books.value.reduce((sum, book) => sum + book.availableCopies, 0)
)

const overdueBooks = computed(() => 2) // Mock data

// Filtered books based on search
const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value
  
  const query = searchQuery.value.toLowerCase()
  return books.value.filter(book => 
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    book.isbn.toLowerCase().includes(query) ||
    book.inventoryNumber.toLowerCase().includes(query)
  )
})

// Paginated books
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredBooks.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => 
  Math.ceil(filteredBooks.value.length / itemsPerPage.value)
)

// Methods
const generateSignature = (book) => {
  const authorInitials = book.author
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
  const year = new Date().getFullYear().toString().slice(-2)
  const seq = (books.value.length + 1).toString().padStart(3, '0')
  return `${authorInitials}${year}${seq}`
}

const generateInventoryNumber = () => {
  const year = new Date().getFullYear()
  const seq = (books.value.length + 1).toString().padStart(3, '0')
  return `INV-${year}-${seq}`
}

const resetForm = () => {
  newBook.value = {
    title: '',
    author: '',
    isbn: '',
    barcode: '',
    signature: '',
    inventoryNumber: '',
    totalCopies: 1,
    category: ''
  }
}

const handleAddBook = async () => {
  try {
    isLoading.value = true
    
    // Generate signature and inventory number if not provided
    if (!newBook.value.signature) {
    newBook.value.signature = generateSignature(newBook.value)
    }
    if (!newBook.value.inventoryNumber) {
      newBook.value.inventoryNumber = generateInventoryNumber()
    }
    
    const bookToAdd = {
      id: books.value.length + 1,
      ...newBook.value,
      availableCopies: newBook.value.totalCopies,
      lentCopies: 0,
      publishedYear: new Date().getFullYear()
    }
    
    books.value.push(bookToAdd)
    showToast('Book added successfully!', 'success')
    resetForm()
  } catch (error) {
    showToast('Failed to add book', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleEditBook = async () => {
  try {
    isLoading.value = true
    
    const index = books.value.findIndex(book => book.id === selectedBook.value.id)
    if (index !== -1) {
      books.value[index] = { ...selectedBook.value }
      showToast('Book updated successfully!', 'success')
    }
  } catch (error) {
    showToast('Failed to update book', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleDeleteBook = async (book) => {
  if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
    try {
      const index = books.value.findIndex(b => b.id === book.id)
      if (index !== -1) {
        books.value.splice(index, 1)
        showToast('Book deleted successfully!', 'success')
      }
    } catch (error) {
      showToast('Failed to delete book', 'error')
    }
  }
}

const goToBookDetail = (book) => {
  router.push(`/dashboard/library/library-books/${book.id}`)
}

const goToAddBook = () => {
  router.push('/dashboard/library/library-books/new')
}

// Check if mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// Watch for search changes
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter">
    <div class="p-6 space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-600 dark:text-white flex items-center gap-3">
            <BookOpen class="w-8 h-8 text-yellow-500" />
            Books Inventory
          </h1>
          <p class="text-slate-500 dark:text-gray-400 mt-2">
            Manage your library's book collection and inventory
          </p>
        </div>
      </div>

      <!-- Infographics Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Books -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Total Books</p>
              <p class="text-3xl font-bold text-slate-600 dark:text-white mt-1">{{ totalBooks }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Books Lent -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Books Lent</p>
              <p class="text-3xl font-bold text-slate-600 dark:text-white mt-1">{{ totalLentBooks }}</p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Users class="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Books Available -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Books Available</p>
              <p class="text-3xl font-bold text-slate-600 dark:text-white mt-1">{{ totalAvailableBooks }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Books Overdue -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Books Overdue</p>
              <p class="text-3xl font-bold text-slate-600 dark:text-white mt-1">{{ overdueBooks }}</p>
            </div>
            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <!-- Search Bar -->
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, author, ISBN, or inventory number..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="goToAddBook"
              class="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <Plus class="w-5 h-5" />
              Add New Book
            </button>
          </div>
        </div>
      </div>

      <!-- Books Table/Cards -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <!-- Desktop Table View -->
        <div v-if="!isMobile" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Author</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">ISBN</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Barcode</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Signature</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Inventory #</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Available</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="book in paginatedBooks" :key="book.id" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-slate-600 dark:text-white">{{ book.title }}</div>
                  <div class="text-xs text-slate-400 dark:text-gray-400">{{ book.category }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300">{{ book.author }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300 font-mono">{{ book.isbn }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300 font-mono">{{ book.barcode }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300 font-mono">{{ book.signature }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300 font-mono">{{ book.inventoryNumber }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    book.availableCopies > 0 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  ]">
                    {{ book.availableCopies }} / {{ book.totalCopies }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="goToBookDetail(book)"
                    class="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Edit class="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    @click="handleDeleteBook(book)"
                    class="inline-flex items-center px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 class="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div v-else class="p-4 space-y-4">
          <div
            v-for="book in paginatedBooks"
            :key="book.id"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h3 class="font-semibold text-slate-600 dark:text-white text-lg">{{ book.title }}</h3>
                <p class="text-slate-500 dark:text-gray-400 text-sm">by {{ book.author }}</p>
              </div>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                book.availableCopies > 0 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
              ]">
                {{ book.availableCopies }}/{{ book.totalCopies }} Available
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-gray-400 mb-4">
              <div><span class="font-medium">ISBN:</span> {{ book.isbn }}</div>
              <div><span class="font-medium">Inventory:</span> {{ book.inventoryNumber }}</div>
              <div><span class="font-medium">Barcode:</span> {{ book.barcode }}</div>
              <div><span class="font-medium">Signature:</span> {{ book.signature }}</div>
            </div>
            
            <div class="flex gap-2">
              <button
                @click="goToBookDetail(book)"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm"
              >
                <Edit class="w-4 h-4" />
                Edit
              </button>
              <button
                @click="handleDeleteBook(book)"
                class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors text-sm"
              >
                <Trash2 class="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-500 dark:text-gray-400">
              Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredBooks.length) }} of {{ filteredBooks.length }} results
            </div>
            <div class="flex gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-slate-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-slate-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 

<style scoped>
.font-inter {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style> 