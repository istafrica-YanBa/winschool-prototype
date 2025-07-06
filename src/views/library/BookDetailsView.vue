<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BookOpen, Users, History, Layers, Info, Search, Plus, Edit, Save, X, Dice5, Pencil, Trash2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isNew = computed(() => route.path.endsWith('/new'))
const bookId = computed(() => route.params.id)

// Mock book data (replace with API integration)
const originalBook = reactive({
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
  publishedYear: 2023,
  group: '10A',
  price: '€24.99',
  subject: 'Mathematics',
  keywords: ['algebra', 'geometry', 'analysis'],
  acquisitionDate: '2024-01-15',
  supplier: 'EduBooks GmbH',
  location: 'Shelf 3B',
  initialStock: 5,
  sameIsbnCount: 2,
  reservedCount: 1,
  currentStock: 3,
  publisher: 'Springer',
  edition: '2nd',
  year: 2023,
  loanDuration: 30,
  loanType: 'Standard',
  lowValue: false,
  // Additional fields for right card
  retailPrice: '',
  lendingPrice: '',
  discountedPrice: '',
  depreciation: '',
  lendingRate: ''
})
const book = reactive(isNew.value ? {
  id: null,
  title: '',
  author: '',
  isbn: '',
  barcode: '',
  signature: '',
  inventoryNumber: '',
  totalCopies: 1,
  availableCopies: 1,
  lentCopies: 0,
  category: '',
  publishedYear: '',
  group: '',
  price: '',
  subject: '',
  keywords: [],
  acquisitionDate: '',
  supplier: '',
  location: '',
  initialStock: 1,
  sameIsbnCount: 0,
  reservedCount: 0,
  currentStock: 1,
  publisher: '',
  edition: '',
  year: '',
  loanDuration: '',
  loanType: '',
  lowValue: false,
  retailPrice: '',
  lendingPrice: '',
  discountedPrice: '',
  depreciation: '',
  lendingRate: ''
} : { ...originalBook })

const editMode = ref(isNew.value)
const backupBook = ref(null)

function startEdit() {
  backupBook.value = { ...book }
  editMode.value = true
}

function resetNewBook() {
  Object.assign(book, {
    id: null,
    title: '',
    author: '',
    isbn: '',
    barcode: '',
    signature: '',
    inventoryNumber: '',
    totalCopies: 1,
    availableCopies: 1,
    lentCopies: 0,
    category: '',
    publishedYear: '',
    group: '',
    price: '',
    subject: '',
    keywords: [],
    acquisitionDate: '',
    supplier: '',
    location: '',
    initialStock: 1,
    sameIsbnCount: 0,
    reservedCount: 0,
    currentStock: 1,
    publisher: '',
    edition: '',
    year: '',
    loanDuration: '',
    loanType: '',
    lowValue: false,
    retailPrice: '',
    lendingPrice: '',
    discountedPrice: '',
    depreciation: '',
    lendingRate: ''
  })
  loanHistory.value = []
  entries.value = []
  editMode.value = true
}
function cancelEdit() {
  if (isNew.value) {
    resetNewBook()
  } else {
    Object.assign(book, backupBook.value)
    editMode.value = false
  }
}
function saveEdit() {
  // TODO: Replace with backend call
  Object.assign(originalBook, book)
  editMode.value = false
}

const activeTab = ref('info')
const tabs = [
  { id: 'info', label: 'Book Information', icon: Info },
  { id: 'history', label: 'Loan History', icon: History },
  { id: 'entries', label: 'Entries & Exits', icon: Layers },
  { id: 'joker', label: 'Joker', icon: Dice5 }
]

// Mock data for tabs
const loanHistory = ref(isNew.value ? [] : [
  { id: 1, borrower: 'Emma Müller', role: 'Student', start: '2024-02-01', end: '2024-02-28', status: 'Returned', damaged: false, lost: false },
  { id: 2, borrower: 'Liam Weber', role: 'Staff', start: '2024-03-01', end: '', status: 'In Progress', damaged: false, lost: false },
  { id: 3, borrower: 'Sophie Schmidt', role: 'Student', start: '2023-12-10', end: '2024-01-10', status: 'Overdue', damaged: true, lost: false }
])
const entries = ref(isNew.value ? [] : [
  { id: 1, date: '2025-06-26', entry: 20, exit: '', reason: 'New acquisition', remark: '' },
  { id: 2, date: '2025-07-01', entry: '', exit: 2, reason: 'Damaged', remark: 'Torn pages' },
  { id: 3, date: '2025-07-02', entry: 5, exit: '', reason: 'Donation', remark: 'Parent donation' },
])

// Quick Lookup Modal
const showQuickLookup = ref(false)
const quickQuery = ref('')
const quickResults = ref([])
function openQuickLookup() { showQuickLookup.value = true }
function closeQuickLookup() { showQuickLookup.value = false }
function searchQuick() {
  quickResults.value = [
    { id: 4, title: 'Modern Physics Concepts', isbn: '978-3-16-148412-4', barcode: 'BRC001234569', inventoryNumber: 'INV-2024-003' }
  ]
}
function selectQuickResult(result) {
  router.push(`/dashboard/library/library-books/${result.id}`)
  closeQuickLookup()
}

const maxWidth = 'max-w-[1300px]'

const keywordsInput = ref(book.keywords.join(', '))
function onKeywordsInput(e) {
  book.keywords = keywordsInput.value.split(',').map(k => k.trim()).filter(Boolean)
}

const showEntryModal = ref(false)
const entryForm = ref({
  quantity: '',
  price: '',
  date: '',
  reason: '',
  remark: ''
})
const selectedEntryIds = ref([])
const allEntriesSelected = ref(false)

function toggleAllEntries(event) {
  allEntriesSelected.value = event.target.checked
  selectedEntryIds.value = entries.value.map(entry => entry.id)
}

const editingEntryId = ref(null)
function editEntry(entry) {
  entryForm.value = { ...entry, quantity: entry.entry || entry.exit, date: entry.date, price: entry.price || '', reason: entry.reason, remark: entry.remark }
  editingEntryId.value = entry.id
  showEntryModal.value = true
}
function addEntry() {
  if (editingEntryId.value) {
    // Edit existing
    const idx = entries.value.findIndex(e => e.id === editingEntryId.value)
    if (idx !== -1) {
      entries.value[idx] = {
        ...entries.value[idx],
        date: entryForm.value.date,
        entry: entryForm.value.quantity > 0 ? entryForm.value.quantity : '',
        exit: entryForm.value.quantity < 0 ? Math.abs(entryForm.value.quantity) : '',
        price: entryForm.value.price,
        reason: entryForm.value.reason,
        remark: entryForm.value.remark
      }
    }
    editingEntryId.value = null
  } else {
    // Add new
    entries.value.unshift({
      id: Date.now(),
      date: entryForm.value.date,
      entry: entryForm.value.quantity > 0 ? entryForm.value.quantity : '',
      exit: entryForm.value.quantity < 0 ? Math.abs(entryForm.value.quantity) : '',
      price: entryForm.value.price,
      reason: entryForm.value.reason,
      remark: entryForm.value.remark
    })
  }
  showEntryModal.value = false
}
function deleteEntry(id) {
  if (confirm('Are you sure you want to delete this entry?')) {
    entries.value = entries.value.filter(e => e.id !== id)
  }
}

// Add pagination state for both tables
const loanHistoryPage = ref(1)
const entriesPage = ref(1)
const ITEMS_PER_PAGE = 5
const paginatedLoanHistory = computed(() => {
  const start = (loanHistoryPage.value - 1) * ITEMS_PER_PAGE
  return loanHistory.value.slice(start, start + ITEMS_PER_PAGE)
})
const paginatedEntries = computed(() => {
  const start = (entriesPage.value - 1) * ITEMS_PER_PAGE
  return entries.value.slice(start, start + ITEMS_PER_PAGE)
})
const loanHistoryPageCount = computed(() => Math.ceil(loanHistory.value.length / ITEMS_PER_PAGE))
const entriesPageCount = computed(() => Math.ceil(entries.value.length / ITEMS_PER_PAGE))

const showExitModal = ref(false)
const exitForm = ref({
  count: '',
  bookNumbers: ''
})
function openExitModal() {
  if (isNew.value) return // No exits allowed for new book
  showExitModal.value = true
  exitForm.value = { count: '', bookNumbers: '' }
}
function submitExit() {
  entries.value.unshift({
    id: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    entry: '',
    exit: exitForm.value.count,
    reason: 'Book exit',
    remark: exitForm.value.bookNumbers ? `Book numbers: ${exitForm.value.bookNumbers}` : ''
  })
  showExitModal.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter flex flex-col items-center">
    <div class="w-full max-w-[1680px] mx-auto py-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <BookOpen class="w-8 h-8 text-[#FECF44]" />
          <h1 class="text-2xl md:text-3xl font-bold text-slate-700 dark:text-white">Book Details</h1>
        </div>
        <div class="flex gap-2 items-center">
          <button @click="openQuickLookup" class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
            <Search class="w-5 h-5" /> Quick Lookup
          </button>
          <button v-if="!editMode && !isNew" @click="startEdit" class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
            <Edit class="w-5 h-5" /> Edit Details
          </button>
          <div v-else class="flex gap-2">
            <button @click="saveEdit" class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
              <Save class="w-5 h-5" /> Save
            </button>
            <button @click="cancelEdit" class="bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
              <X class="w-5 h-5" /> Cancel
            </button>
          </div>
        </div>
      </div>
      <!-- Horizontal Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2',
                activeTab === tab.id
                  ? 'border-[#FECF44] text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5" />
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>
      <!-- Tab Content -->
      <div>
        <!-- Book Information Tab -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'info'" key="info" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
              <div class="flex flex-col gap-2">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div v-if="!editMode" class="text-xl font-semibold text-slate-800 dark:text-white">{{ book.title }}</div>
                    <input v-else v-model="book.title" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white font-semibold text-xl" />
                    <div class="text-slate-500 dark:text-gray-400">by <span v-if="!editMode">{{ book.author }}</span><input v-else v-model="book.author" class="border-b border-gray-300 dark:border-gray-600 bg-transparent text-slate-500 dark:text-gray-400 ml-1" /></div>
                  </div>
                  <div class="flex gap-2 flex-wrap">
                    <span v-if="!editMode" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                      <BookOpen class="w-4 h-4 mr-1" /> {{ book.category }}
                    </span>
                    <select v-else v-model="book.category" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs">
                      <option value="Mathematics">Mathematics</option>
                      <option value="Literature">Literature</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="History">History</option>
                      <option value="Biology">Biology</option>
                    </select>
                    <span v-if="!editMode" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {{ book.group }}
                    </span>
                    <input v-else v-model="book.group" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs w-24" />
                    <span v-if="!editMode" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      {{ book.currentStock }} in stock
                    </span>
                    <input v-else v-model="book.currentStock" type="number" class="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs w-24" />
                  </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Inventory Number</div>
                    <div v-if="!editMode" class="font-mono text-slate-800 dark:text-white">{{ book.inventoryNumber }}</div>
                    <input v-else v-model="book.inventoryNumber" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 font-mono" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Group / Target grade level</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.group }}</div>
                    <input v-else v-model="book.group" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Title</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.title }}</div>
                    <input v-else v-model="book.title" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">ISBN</div>
                    <div v-if="!editMode" class="font-mono text-slate-800 dark:text-white">{{ book.isbn }}</div>
                    <input v-else v-model="book.isbn" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 font-mono" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Signature</div>
                    <div v-if="!editMode" class="font-mono text-slate-800 dark:text-white">{{ book.signature }}</div>
                    <input v-else v-model="book.signature" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 font-mono" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Price</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.price }}</div>
                    <input v-else v-model="book.price" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Subject</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.subject }}</div>
                    <input v-else v-model="book.subject" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Keywords</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white flex flex-wrap gap-1">
                      <span v-for="kw in book.keywords" :key="kw" class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{{ kw }}</span>
                    </div>
                    <input v-else v-model="keywordsInput" @input="onKeywordsInput" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" placeholder="Comma separated" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Acquisition date</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.acquisitionDate }}</div>
                    <input v-else v-model="book.acquisitionDate" type="date" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Supplier</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.supplier }}</div>
                    <input v-else v-model="book.supplier" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Location / Shelf</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.location }}</div>
                    <input v-else v-model="book.location" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Initial Stock</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.initialStock }}</div>
                    <input v-else v-model="book.initialStock" type="number" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Books with same ISBN</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.sameIsbnCount }}</div>
                    <input v-else v-model="book.sameIsbnCount" type="number" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Lent count</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.lentCopies }}</div>
                    <input v-else v-model="book.lentCopies" type="number" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Reserved count</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.reservedCount }}</div>
                    <input v-else v-model="book.reservedCount" type="number" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Current stock</div>
                    <div v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.currentStock }}</div>
                    <input v-else v-model="book.currentStock" type="number" class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
              <div class="text-lg font-semibold text-slate-700 dark:text-white mb-2">Additional Information</div>
              <div class="space-y-2">
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Publisher (Verlag)</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.publisher }}</span>
                  <input v-else v-model="book.publisher" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Author</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.author }}</span>
                  <input v-else v-model="book.author" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Edition (Auflage)</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.edition }}</span>
                  <input v-else v-model="book.edition" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Year of Publication</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.year }}</span>
                  <input v-else v-model="book.year" type="number" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Loan duration in days</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.loanDuration }}</span>
                  <input v-else v-model="book.loanDuration" type="number" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Loan type</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.loanType }}</span>
                  <input v-else v-model="book.loanType" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 items-center">
                  <span class="text-slate-500 dark:text-gray-400">Low-value learning material</span>
                  <input v-if="editMode" type="checkbox" v-model="book.lowValue" class="form-checkbox h-4 w-4 text-yellow-500 border-gray-300 rounded" />
                  <input v-else type="checkbox" :checked="book.lowValue" disabled class="form-checkbox h-4 w-4 text-yellow-500 border-gray-300 rounded" />
                </div>
                <hr class="my-3 border-gray-300 dark:border-gray-600" />
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Identifier (ISBN)</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.isbn }}</span>
                  <input v-else v-model="book.isbn" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 font-mono" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Retail Price</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.retailPrice }}</span>
                  <input v-else v-model="book.retailPrice" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Lending Price</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.lendingPrice }}</span>
                  <input v-else v-model="book.lendingPrice" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Discounted Price</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.discountedPrice }}</span>
                  <input v-else v-model="book.discountedPrice" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span class="text-slate-500 dark:text-gray-400">Depreciation</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.depreciation }}</span>
                  <input v-else v-model="book.depreciation" class="w-full sm:w-2/3 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 items-center">
                  <span class="text-slate-500 dark:text-gray-400">Lending Rate</span>
                  <span v-if="!editMode" class="text-slate-800 dark:text-white">{{ book.lendingRate }} %</span>
                  <div v-else class="flex items-center w-full sm:w-2/3">
                    <input v-model="book.lendingRate" type="number" class="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                    <span class="ml-2">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <!-- Loan History Tab -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'history'" key="history">
            <div class="block md:hidden space-y-3">
              <div v-for="entry in paginatedLoanHistory" :key="entry.id" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-1">
                <div class="flex justify-between"><span class="font-semibold">Borrower:</span> <span>{{ entry.borrower }}</span></div>
                <div class="flex justify-between"><span class="font-semibold">Role:</span> <span>{{ entry.role }}</span></div>
                <div class="flex justify-between"><span class="font-semibold">Start Date:</span> <span>{{ entry.start }}</span></div>
                <div class="flex justify-between"><span class="font-semibold">Return Date:</span> <span>{{ entry.end || '-' }}</span></div>
                <div class="flex justify-between"><span class="font-semibold">Status:</span>
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    entry.status === 'Returned' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                    entry.status === 'Overdue' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  ]">
                    {{ entry.status }}
                  </span>
                </div>
                <div class="flex justify-between"><span class="font-semibold">Damaged/Lost:</span>
                  <span v-if="entry.damaged" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 mr-1">Damaged</span>
                  <span v-if="entry.lost" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">Lost</span>
                  <span v-if="!entry.damaged && !entry.lost">-</span>
                </div>
              </div>
              <div v-if="loanHistoryPageCount > 1" class="flex justify-center mt-2 gap-2">
                <button v-for="n in loanHistoryPageCount" :key="n" @click="loanHistoryPage = n" :class="['px-3 py-1 rounded', loanHistoryPage === n ? 'bg-[#FECF44] text-slate-900' : 'bg-gray-200 dark:bg-gray-700 text-slate-700 dark:text-white']">{{ n }}</button>
              </div>
            </div>
            <div class="hidden md:block">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Borrower</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Role</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Start Date</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Return Date</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Status</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Damaged/Lost</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="entry in paginatedLoanHistory" :key="entry.id">
                      <td class="px-4 py-2">{{ entry.borrower }}</td>
                      <td class="px-4 py-2">{{ entry.role }}</td>
                      <td class="px-4 py-2">{{ entry.start }}</td>
                      <td class="px-4 py-2">{{ entry.end || '-' }}</td>
                      <td class="px-4 py-2">
                        <span :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          entry.status === 'Returned' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          entry.status === 'Overdue' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        ]">
                          {{ entry.status }}
                        </span>
                      </td>
                      <td class="px-4 py-2">
                        <span v-if="entry.damaged" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 mr-1">
                          Damaged
                        </span>
                        <span v-if="entry.lost" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                          Lost
                        </span>
                        <span v-if="!entry.damaged && !entry.lost">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-if="loanHistory.length === 0" class="text-center text-slate-400 dark:text-gray-500 py-8">No records yet.</div>
          </div>
        </transition>
        <!-- Entries & Exits Tab -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'entries'" key="entries">
            <div class="hidden md:flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Entries & Exits</h3>
              <div class="flex gap-2">
                <button class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 px-4 py-2 rounded-lg flex items-center gap-2" @click="showEntryModal = true">
                  <Plus class="w-4 h-4" /> Add
                </button>
                <button v-if="!isNew" class="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2" @click="openExitModal">
                  <X class="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
            <div class="block md:hidden mb-3">
              <div class="flex gap-2">
                <button class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 px-4 py-2 rounded-lg flex items-center gap-2" @click="showEntryModal = true">
                  <Plus class="w-4 h-4" /> Add
                </button>
                <button v-if="!isNew" class="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2" @click="openExitModal">
                  <X class="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
            <div class="block md:hidden space-y-3">
              <div v-for="entry in paginatedEntries" :key="entry.id" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-1">
                <div class="flex justify-between"><span class="font-semibold">Date:</span> <span>{{ entry.date }}</span></div>
                <div class="flex justify-between"><span class="font-semibold">Entry:</span> <span>{{ entry.entry }}</span></div>
                <div class="flex justify-between"><span class="font-semibold">Exit:</span> <span>{{ entry.exit }}</span></div>
                <div class="flex justify-between"><span class="font-semibold">Reason:</span> <span>{{ entry.reason }}</span></div>
                <div class="flex justify-between"><span class="font-semibold">Remark:</span> <span>{{ entry.remark }}</span></div>
                <div class="flex justify-end gap-2 mt-2">
                  <button @click="editEntry(entry)" class="text-blue-500 hover:text-blue-700"><Pencil class="w-5 h-5" /></button>
                  <button @click="deleteEntry(entry.id)" class="text-red-500 hover:text-red-700"><Trash2 class="w-5 h-5" /></button>
                </div>
              </div>
              <div v-if="entriesPageCount > 1" class="flex justify-center mt-2 gap-2">
                <button v-for="n in entriesPageCount" :key="n" @click="entriesPage = n" :class="['px-3 py-1 rounded', entriesPage === n ? 'bg-[#FECF44] text-slate-900' : 'bg-gray-200 dark:bg-gray-700 text-slate-700 dark:text-white']">{{ n }}</button>
              </div>
            </div>
            <div v-if="entries.length === 0" class="text-center text-slate-400 dark:text-gray-500 py-8">No records yet.</div>
            <div class="hidden md:block">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Date</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Entry</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Exit</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Reason</th>
                      <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase">Remark</th>
                      <th class="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="entry in paginatedEntries" :key="entry.id">
                      <td class="px-4 py-2">{{ entry.date }}</td>
                      <td class="px-4 py-2">{{ entry.entry }}</td>
                      <td class="px-4 py-2">{{ entry.exit }}</td>
                      <td class="px-4 py-2">{{ entry.reason }}</td>
                      <td class="px-4 py-2">{{ entry.remark }}</td>
                      <td class="px-4 py-2 text-center">
                        <button @click="editEntry(entry)" class="text-blue-500 hover:text-blue-700 mr-2"><Pencil class="w-4 h-4" /></button>
                        <button @click="deleteEntry(entry.id)" class="text-red-500 hover:text-red-700"><Trash2 class="w-4 h-4" /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- Add Entry Modal -->
            <div v-if="showEntryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button @click="showEntryModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400">
                  <X class="w-6 h-6" />
                </button>
                <h2 class="text-xl font-bold text-slate-700 dark:text-white mb-4">Add Entry/Exit</h2>
                <form @submit.prevent="addEntry">
                  <div class="mb-3">
                    <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Quantity</label>
                    <input v-model.number="entryForm.quantity" type="number" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                  </div>
                  <div class="mb-3">
                    <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Price</label>
                    <input v-model="entryForm.price" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div class="mb-3">
                    <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Date</label>
                    <input v-model="entryForm.date" type="date" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                  </div>
                  <div class="mb-3">
                    <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Reason</label>
                    <input v-model="entryForm.reason" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" required />
                  </div>
                  <div class="mb-3">
                    <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Remark</label>
                    <textarea v-model="entryForm.remark" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"></textarea>
                  </div>
                  <div class="flex justify-end gap-2 mt-4">
                    <button type="button" class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium px-4 py-2 rounded-lg" @click="() => {/* TODO: open individual book entry modal */}">Individual Book Entry</button>
                    <button type="button" @click="showEntryModal = false" class="bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-white font-medium px-4 py-2 rounded-lg">Cancel</button>
                    <button type="submit" class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 font-medium px-4 py-2 rounded-lg">Add</button>
                  </div>
                </form>
              </div>
            </div>
            <!-- Exit Modal -->
            <div v-if="showExitModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 relative">
                <button @click="showExitModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400">
                  <X class="w-6 h-6" />
                </button>
                <h2 class="text-xl font-bold text-slate-700 dark:text-white mb-4">Exit Books from Library</h2>
                <form @submit.prevent="submitExit">
                  <div class="mb-3">
                    <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Number of books exited</label>
                    <input v-model.number="exitForm.count" type="number" min="1" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
                  </div>
                  <div class="mb-3">
                    <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Book numbers (optional)</label>
                    <textarea v-model="exitForm.bookNumbers" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" placeholder="Enter book numbers, comma separated"></textarea>
                  </div>
                  <div class="flex justify-end gap-2 mt-4">
                    <button type="button" @click="showExitModal = false" class="bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-white font-medium px-4 py-2 rounded-lg">Cancel</button>
                    <button type="submit" class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 font-medium px-4 py-2 rounded-lg">Exit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </transition>
        <!-- Joker Tab -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'joker'" key="joker">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Joker Tab</h3>
              <p class="text-slate-500 dark:text-gray-400">Reserved for future extensions.</p>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <!-- Quick Lookup Modal -->
    <div v-if="showQuickLookup" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
        <button @click="closeQuickLookup" class="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400">
          <X class="w-6 h-6" />
        </button>
        <h2 class="text-xl font-bold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
          <Search class="w-5 h-5" /> Quick Lookup
        </h2>
        <div class="flex gap-2 mb-4">
          <input v-model="quickQuery" type="text" placeholder="Title, ISBN, barcode, signature..." class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors" />
          <button @click="searchQuick" class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Search class="w-4 h-4" />
            Search
          </button>
        </div>
        <div v-if="quickResults.length" class="space-y-2">
          <div v-for="result in quickResults" :key="result.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div class="font-semibold text-slate-800 dark:text-white">{{ result.title }}</div>
              <div class="text-xs text-slate-500 dark:text-gray-400">ISBN: {{ result.isbn }}</div>
              <div class="text-xs text-slate-500 dark:text-gray-400">Barcode: {{ result.barcode }}</div>
              <div class="text-xs text-slate-500 dark:text-gray-400">Inventory #: {{ result.inventoryNumber }}</div>
            </div>
            <button @click="selectQuickResult(result)" class="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm flex items-center gap-2">
              <BookOpen class="w-4 h-4" /> View
            </button>
          </div>
        </div>
        <div v-else class="text-slate-400 dark:text-gray-500 text-sm">No results found.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
.max-w-1300px {
  max-width: 1300px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 