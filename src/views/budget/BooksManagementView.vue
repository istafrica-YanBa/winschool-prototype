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
            {{ language === 'de' ? 'Bücherverwaltung' : 'Books Management' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Katalog aller Bücher der Schule mit ISBN, Titel, Autor und weiteren Details' : 'Catalog of all books owned by the school with ISBN, title, author and more details' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showAddBook = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Buch hinzufügen' : 'Add Book' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in bookStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
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
            {{ language === 'de' ? 'Fach' : 'Subject' }}
          </label>
          <select v-model="filters.subject" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Fächer' : 'All Subjects' }}</option>
            <option value="Mathematics">{{ language === 'de' ? 'Mathematik' : 'Mathematics' }}</option>
            <option value="Science">{{ language === 'de' ? 'Naturwissenschaften' : 'Science' }}</option>
            <option value="History">{{ language === 'de' ? 'Geschichte' : 'History' }}</option>
            <option value="Literature">{{ language === 'de' ? 'Literatur' : 'Literature' }}</option>
            <option value="Languages">{{ language === 'de' ? 'Sprachen' : 'Languages' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Kategorie' : 'Category' }}
          </label>
          <select v-model="filters.category" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Kategorien' : 'All Categories' }}</option>
            <option value="Textbook">{{ language === 'de' ? 'Lehrbuch' : 'Textbook' }}</option>
            <option value="Reference">{{ language === 'de' ? 'Nachschlagewerk' : 'Reference' }}</option>
            <option value="Fiction">{{ language === 'de' ? 'Belletristik' : 'Fiction' }}</option>
            <option value="Research">{{ language === 'de' ? 'Forschung' : 'Research' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Verfügbarkeit' : 'Availability' }}
          </label>
          <select v-model="filters.availability" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="available">{{ language === 'de' ? 'Verfügbar' : 'Available' }}</option>
            <option value="limited">{{ language === 'de' ? 'Begrenzt' : 'Limited' }}</option>
            <option value="out-of-stock">{{ language === 'de' ? 'Vergriffen' : 'Out of Stock' }}</option>
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
          :placeholder="language === 'de' ? 'Bücher suchen (Titel, Autor, ISBN)...' : 'Search books (title, author, ISBN)...'"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Books Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Buchkatalog' : 'Book Catalog' }}
        </h2>
        
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'ISBN' : 'ISBN' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Titel' : 'Title' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Autor' : 'Author' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Fach' : 'Subject' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Kopien' : 'Copies' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Kategorie' : 'Category' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in filteredBooks" :key="book.id" class="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="py-3 px-4">
                  <div class="text-sm font-mono text-slate-600 dark:text-slate-400">{{ book.isbn }}</div>
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ book.title }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ book.edition }}</div>
                </td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ book.author }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getSubjectColor(book.subject)">
                    {{ language === 'de' ? getSubjectTranslation(book.subject) : book.subject }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-slate-800 dark:text-slate-200">{{ book.availableCopies }}/{{ book.totalCopies }}</span>
                    <span class="text-xs" :class="getAvailabilityColor(book.availableCopies, book.totalCopies)">
                      {{ getAvailabilityStatus(book.availableCopies, book.totalCopies) }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getCategoryColor(book.category)">
                    {{ language === 'de' ? getCategoryTranslation(book.category) : book.category }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="editBook(book)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Edit class="h-4 w-4" />
                    </button>
                    <button @click="viewDetails(book)" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="deleteBook(book.id)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <div v-for="book in filteredBooks" :key="book.id" class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-medium text-slate-800 dark:text-slate-200">{{ book.title }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ book.author }}</p>
              </div>
              <div class="flex space-x-2">
                <button @click="editBook(book)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Edit class="h-4 w-4" />
                </button>
                <button @click="viewDetails(book)" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                  <Eye class="h-4 w-4" />
                </button>
                <button @click="deleteBook(book.id)" class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'ISBN:' : 'ISBN:' }}</span>
                <span class="text-sm font-mono text-slate-700 dark:text-slate-300">{{ book.isbn }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Fach:' : 'Subject:' }}</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getSubjectColor(book.subject)">
                  {{ language === 'de' ? getSubjectTranslation(book.subject) : book.subject }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Verfügbar:' : 'Available:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ book.availableCopies }}/{{ book.totalCopies }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Kategorie:' : 'Category:' }}</span>
                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getCategoryColor(book.category)">
                  {{ language === 'de' ? getCategoryTranslation(book.category) : book.category }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Book Modal -->
    <div v-if="showAddBook || editingBook" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">
          {{ editingBook ? (language === 'de' ? 'Buch bearbeiten' : 'Edit Book') : (language === 'de' ? 'Buch hinzufügen' : 'Add Book') }}
        </h3>
        <form @submit.prevent="saveBook" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'ISBN' : 'ISBN' }}
              </label>
              <input
                v-model="bookForm.isbn"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Ausgabe' : 'Edition' }}
              </label>
              <input
                v-model="bookForm.edition"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Titel' : 'Title' }}
            </label>
            <input
              v-model="bookForm.title"
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
              v-model="bookForm.author"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Fach' : 'Subject' }}
              </label>
              <select
                v-model="bookForm.subject"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">{{ language === 'de' ? 'Fach auswählen' : 'Select Subject' }}</option>
                <option value="Mathematics">{{ language === 'de' ? 'Mathematik' : 'Mathematics' }}</option>
                <option value="Science">{{ language === 'de' ? 'Naturwissenschaften' : 'Science' }}</option>
                <option value="History">{{ language === 'de' ? 'Geschichte' : 'History' }}</option>
                <option value="Literature">{{ language === 'de' ? 'Literatur' : 'Literature' }}</option>
                <option value="Languages">{{ language === 'de' ? 'Sprachen' : 'Languages' }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Kategorie' : 'Category' }}
              </label>
              <select
                v-model="bookForm.category"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value="">{{ language === 'de' ? 'Kategorie auswählen' : 'Select Category' }}</option>
                <option value="Textbook">{{ language === 'de' ? 'Lehrbuch' : 'Textbook' }}</option>
                <option value="Reference">{{ language === 'de' ? 'Nachschlagewerk' : 'Reference' }}</option>
                <option value="Fiction">{{ language === 'de' ? 'Belletristik' : 'Fiction' }}</option>
                <option value="Research">{{ language === 'de' ? 'Forschung' : 'Research' }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {{ language === 'de' ? 'Gesamtanzahl Kopien' : 'Total Copies' }}
            </label>
            <input
              v-model.number="bookForm.totalCopies"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div class="flex space-x-3">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {{ editingBook ? (language === 'de' ? 'Aktualisieren' : 'Update') : (language === 'de' ? 'Hinzufügen' : 'Add') }}
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
  BookOpen, Plus, Filter, Search, Edit, Trash2, ChevronRight, Eye,
  Library, Users, Clock, AlertTriangle
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const language = computed(() => themeStore.language)

// State
const showFilters = ref(false)
const showAddBook = ref(false)
const editingBook = ref<any>(null)
const searchQuery = ref('')

// Filters
const filters = ref({
  subject: '',
  category: '',
  availability: ''
})

// Form data
const bookForm = ref({
  isbn: '',
  title: '',
  author: '',
  subject: '',
  edition: '',
  category: '',
  totalCopies: 1
})

// Mock data
const books = ref([
  {
    id: 1,
    isbn: '978-0-123456-78-9',
    title: 'Advanced Mathematics for Engineering',
    author: 'Dr. Sarah Johnson',
    subject: 'Mathematics',
    edition: '3rd Edition',
    category: 'Textbook',
    totalCopies: 25,
    availableCopies: 18
  },
  {
    id: 2,
    isbn: '978-1-234567-89-0',
    title: 'Introduction to Chemistry',
    author: 'Prof. Michael Chen',
    subject: 'Science',
    edition: '2nd Edition',
    category: 'Textbook',
    totalCopies: 30,
    availableCopies: 5
  },
  {
    id: 3,
    isbn: '978-2-345678-90-1',
    title: 'World History: A Global Perspective',
    author: 'Dr. Emily Rodriguez',
    subject: 'History',
    edition: '1st Edition',
    category: 'Reference',
    totalCopies: 15,
    availableCopies: 15
  },
  {
    id: 4,
    isbn: '978-3-456789-01-2',
    title: 'Shakespeare Complete Works',
    author: 'William Shakespeare',
    subject: 'Literature',
    edition: 'Annotated Edition',
    category: 'Fiction',
    totalCopies: 20,
    availableCopies: 0
  }
])

// Stats
const bookStats = computed(() => [
  {
    title: language.value === 'de' ? 'Gesamtbücher' : 'Total Books',
    value: books.value.length.toString(),
    change: '+15 this semester',
    changeColor: 'text-green-500',
    icon: BookOpen,
    iconBg: 'bg-blue-600'
  },
  {
    title: language.value === 'de' ? 'Verfügbare Kopien' : 'Available Copies',
    value: books.value.reduce((sum, book) => sum + book.availableCopies, 0).toString(),
    change: `${Math.round((books.value.reduce((sum, book) => sum + book.availableCopies, 0) / books.value.reduce((sum, book) => sum + book.totalCopies, 0)) * 100)}% availability`,
    changeColor: 'text-green-500',
    icon: Library,
    iconBg: 'bg-green-600'
  },
  {
    title: language.value === 'de' ? 'Ausgeliehen' : 'Checked Out',
    value: books.value.reduce((sum, book) => sum + (book.totalCopies - book.availableCopies), 0).toString(),
    change: 'Active lending',
    changeColor: 'text-blue-500',
    icon: Users,
    iconBg: 'bg-purple-600'
  },
  {
    title: language.value === 'de' ? 'Vergriffen' : 'Out of Stock',
    value: books.value.filter(book => book.availableCopies === 0).length.toString(),
    change: 'Need restocking',
    changeColor: 'text-red-500',
    icon: AlertTriangle,
    iconBg: 'bg-red-600'
  }
])

// Computed
const filteredBooks = computed(() => {
  return books.value.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesSubject = !filters.value.subject || book.subject === filters.value.subject
    const matchesCategory = !filters.value.category || book.category === filters.value.category
    const matchesAvailability = !filters.value.availability || 
      (filters.value.availability === 'available' && book.availableCopies > 3) ||
      (filters.value.availability === 'limited' && book.availableCopies > 0 && book.availableCopies <= 3) ||
      (filters.value.availability === 'out-of-stock' && book.availableCopies === 0)
    
    return matchesSearch && matchesSubject && matchesCategory && matchesAvailability
  })
})

// Methods
const getSubjectColor = (subject: string) => {
  const colors = {
    'Mathematics': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Science': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'History': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'Literature': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'Languages': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
  }
  return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const getCategoryColor = (category: string) => {
  const colors = {
    'Textbook': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    'Reference': 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400',
    'Fiction': 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-400',
    'Research': 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
  }
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const getAvailabilityColor = (available: number, total: number) => {
  if (available === 0) return 'text-red-500'
  if (available <= 3) return 'text-yellow-500'
  return 'text-green-500'
}

const getAvailabilityStatus = (available: number, total: number) => {
  if (available === 0) return language.value === 'de' ? 'Vergriffen' : 'Out'
  if (available <= 3) return language.value === 'de' ? 'Wenig' : 'Low'
  return language.value === 'de' ? 'Gut' : 'Good'
}

const getSubjectTranslation = (subject: string) => {
  const translations = {
    'Mathematics': 'Mathematik',
    'Science': 'Naturwissenschaften',
    'History': 'Geschichte',
    'Literature': 'Literatur',
    'Languages': 'Sprachen'
  }
  return translations[subject as keyof typeof translations] || subject
}

const getCategoryTranslation = (category: string) => {
  const translations = {
    'Textbook': 'Lehrbuch',
    'Reference': 'Nachschlagewerk',
    'Fiction': 'Belletristik',
    'Research': 'Forschung'
  }
  return translations[category as keyof typeof translations] || category
}

const editBook = (book: any) => {
  editingBook.value = book
  bookForm.value = { ...book }
  showAddBook.value = true
}

const deleteBook = (id: number) => {
  if (confirm(language.value === 'de' ? 'Buch wirklich löschen?' : 'Are you sure you want to delete this book?')) {
    books.value = books.value.filter(book => book.id !== id)
  }
}

const viewDetails = (book: any) => {
  alert(`${language.value === 'de' ? 'Buchdetails für' : 'Book details for'}: ${book.title}`)
}

const saveBook = () => {
  if (editingBook.value) {
    // Update existing book
    const index = books.value.findIndex(book => book.id === editingBook.value.id)
    if (index !== -1) {
      books.value[index] = { 
        ...bookForm.value, 
        id: editingBook.value.id,
        availableCopies: editingBook.value.availableCopies
      }
    }
  } else {
    // Add new book
    const newBook = {
      ...bookForm.value,
      id: Math.max(...books.value.map(book => book.id)) + 1,
      availableCopies: bookForm.value.totalCopies
    }
    books.value.push(newBook)
  }
  cancelEdit()
}

const cancelEdit = () => {
  showAddBook.value = false
  editingBook.value = null
  bookForm.value = {
    isbn: '',
    title: '',
    author: '',
    subject: '',
    edition: '',
    category: '',
    totalCopies: 1
  }
}
</script> 