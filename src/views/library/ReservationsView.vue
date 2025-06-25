<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { 
  BookOpen, Download, Plus, Search, CheckCircle, XCircle, 
  Users, History, Clock, Mail, TrendingUp, X
} from 'lucide-vue-next'

const { showToast } = useToast()

// UI State
const activeTab = ref('active')
const searchQuery = ref('')
const showAddModal = ref(false)
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const showFulfillModal = ref(false)
const showHistoryModal = ref(false)
const selectedReservation = ref(null)
const selectedUser = ref(null)
const rejectionReason = ref('')

// Filters
const filters = ref({
  status: '',
  method: '',
  dateFrom: '',
  dateTo: ''
})

// Form Data
const newReservation = ref({
  userId: '',
  bookId: '',
  notes: ''
})

// Tabs
const tabs = [
  { id: 'active', name: 'Active Reservations' },
  { id: 'history', name: 'History' }
]

// Mock Data - Enhanced Reservations
const reservations = ref([
  {
    id: 1,
    userId: 'U001',
    userName: 'Emma Thompson',
    userType: 'Student',
    bookId: 'B001',
    bookTitle: 'Advanced Mathematics',
    isbn: '978-0123456789',
    method: 'SELF_SERVICE',
    status: 'PENDING',
    priority: 1,
    requestDate: '2024-01-15',
    approvedDate: null,
    fulfilledDate: null,
    rejectedDate: null,
    notes: 'Needed for calculus exam preparation'
  },
  {
    id: 2,
    userId: 'U002',
    userName: 'James Wilson',
    userType: 'Student',
    bookId: 'B002',
    bookTitle: 'Physics Fundamentals',
    isbn: '978-0987654321',
    method: 'BARCODE',
    status: 'APPROVED',
    priority: 1,
    requestDate: '2024-01-12',
    approvedDate: '2024-01-13',
    fulfilledDate: null,
    rejectedDate: null,
    notes: null
  },
  {
    id: 3,
    userId: 'U003',
    userName: 'Sofia Garcia',
    userType: 'Staff',
    bookId: 'B003',
    bookTitle: 'Chemistry Lab Manual',
    isbn: '978-0456789123',
    method: 'MANUAL',
    status: 'FULFILLED',
    priority: 1,
    requestDate: '2024-01-10',
    approvedDate: '2024-01-11',
    fulfilledDate: '2024-01-14',
    rejectedDate: null,
    notes: 'For semester lab sessions'
  },
  {
    id: 4,
    userId: 'U004',
    userName: 'Michael Chen',
    userType: 'Student',
    bookId: 'B001',
    bookTitle: 'Advanced Mathematics',
    isbn: '978-0123456789',
    method: 'SELF_SERVICE',
    status: 'PENDING',
    priority: 2,
    requestDate: '2024-01-16',
    approvedDate: null,
    fulfilledDate: null,
    rejectedDate: null,
    notes: null
  },
  {
    id: 5,
    userId: 'U005',
    userName: 'Anna Rodriguez',
    userType: 'Teacher',
    bookId: 'B004',
    bookTitle: 'English Literature',
    isbn: '978-0789123456',
    method: 'GROUP',
    status: 'REJECTED',
    priority: 1,
    requestDate: '2024-01-08',
    approvedDate: null,
    fulfilledDate: null,
    rejectedDate: '2024-01-09',
    notes: 'Requested for entire class - multiple copies needed'
  }
])

const users = ref([
  { id: 'U001', name: 'Emma Thompson', type: 'Student', email: 'emma.t@school.edu' },
  { id: 'U002', name: 'James Wilson', type: 'Student', email: 'james.w@school.edu' },
  { id: 'U003', name: 'Sofia Garcia', type: 'Staff', email: 'sofia.g@school.edu' },
  { id: 'U004', name: 'Michael Chen', type: 'Student', email: 'michael.c@school.edu' },
  { id: 'U005', name: 'Anna Rodriguez', type: 'Teacher', email: 'anna.r@school.edu' }
])

const books = ref([
  { id: 'B001', title: 'Advanced Mathematics', isbn: '978-0123456789', availability: 2 },
  { id: 'B002', title: 'Physics Fundamentals', isbn: '978-0987654321', availability: 1 },
  { id: 'B003', title: 'Chemistry Lab Manual', isbn: '978-0456789123', availability: 3 },
  { id: 'B004', title: 'English Literature', isbn: '978-0789123456', availability: 5 }
])

// Computed Properties for Infographics
const pendingCount = computed(() => {
  return reservations.value.filter(r => r.status === 'PENDING').length
})

const approvedCount = computed(() => {
  return reservations.value.filter(r => r.status === 'APPROVED').length
})

const rejectedCount = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return reservations.value.filter(r => 
    r.status === 'REJECTED' && 
    r.rejectedDate && 
    new Date(r.rejectedDate) >= oneWeekAgo
  ).length
})

const fulfilledThisWeek = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return reservations.value.filter(r => 
    r.status === 'FULFILLED' && 
    r.fulfilledDate && 
    new Date(r.fulfilledDate) >= oneWeekAgo
  ).length
})

const topReservedBook = computed(() => {
  const bookCounts = {}
  reservations.value.forEach(r => {
    if (r.status !== 'REJECTED') {
      bookCounts[r.bookTitle] = (bookCounts[r.bookTitle] || 0) + 1
    }
  })
  
  const entries = Object.entries(bookCounts)
  if (entries.length === 0) {
    return { title: 'No reservations', count: 0 }
  }
  
  const topBook = entries.reduce((a, b) => a[1] > b[1] ? a : b)
  return {
    title: topBook[0],
    count: topBook[1]
  }
})

// Filtered and computed data
const filteredReservations = computed(() => {
  let filtered = reservations.value

  // Filter by tab
  if (activeTab.value === 'active') {
    filtered = filtered.filter(r => ['PENDING', 'APPROVED'].includes(r.status))
  } else {
    filtered = filtered.filter(r => ['FULFILLED', 'REJECTED'].includes(r.status))
  }
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(r => 
      r.userName.toLowerCase().includes(query) ||
      r.bookTitle.toLowerCase().includes(query) ||
      r.isbn.includes(query)
    )
  }
  
  // Status filter
  if (filters.value.status) {
    filtered = filtered.filter(r => r.status === filters.value.status)
  }
  
  // Method filter
  if (filters.value.method) {
    filtered = filtered.filter(r => r.method === filters.value.method)
  }
  
  // Date filters
  if (filters.value.dateFrom) {
    filtered = filtered.filter(r => r.requestDate >= filters.value.dateFrom)
  }
  
  if (filters.value.dateTo) {
    filtered = filtered.filter(r => r.requestDate <= filters.value.dateTo)
  }

  return filtered
})

// Utility functions
const getStatusColor = (status) => {
  const colors = {
    'PENDING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'APPROVED': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'FULFILLED': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'REJECTED': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getMethodColor = (method) => {
  const colors = {
    'MANUAL': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'SELF_SERVICE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'BARCODE': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'GROUP': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  }
  return colors[method] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch (error) {
    return dateString
  }
}

const formatMethod = (method) => {
  const methodNames = {
    'MANUAL': 'Manual',
    'SELF_SERVICE': 'Self-Service',
    'BARCODE': 'Barcode',
    'GROUP': 'Group Request'
  }
  return methodNames[method] || method
}

const clearFilters = () => {
  filters.value = {
    status: '',
    method: '',
    dateFrom: '',
    dateTo: ''
  }
  searchQuery.value = ''
}

// Modal handlers
const openApproveModal = (reservation) => {
  selectedReservation.value = reservation
  showApproveModal.value = true
}

const openRejectModal = (reservation) => {
  selectedReservation.value = reservation
  rejectionReason.value = ''
  showRejectModal.value = true
}

const openFulfillModal = (reservation) => {
  selectedReservation.value = reservation
  showFulfillModal.value = true
}

const viewUserHistory = (userId) => {
  selectedUser.value = users.value.find(u => u.id === userId)
  showHistoryModal.value = true
}

const getUserReservations = (userId) => {
  return reservations.value.filter(r => r.userId === userId)
}

// Action handlers
const handleAddReservation = async () => {
  try {
    const user = users.value.find(u => u.id === newReservation.value.userId)
    const book = books.value.find(b => b.id === newReservation.value.bookId)
    
    if (!user || !book) {
      showToast('Please select both user and book', 'error')
    return
  }

    const newReservationRecord = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userType: user.type,
      bookId: book.id,
      bookTitle: book.title,
      isbn: book.isbn,
      method: 'MANUAL',
      status: 'PENDING',
      priority: 1,
      requestDate: new Date().toISOString().split('T')[0],
      approvedDate: null,
      fulfilledDate: null,
      rejectedDate: null,
      notes: newReservation.value.notes
    }
    
    reservations.value.unshift(newReservationRecord)
    showToast('Manual reservation created successfully', 'success')
    showAddModal.value = false
    
    // Reset form
    newReservation.value = {
      userId: '',
      bookId: '',
      notes: ''
    }
  } catch (error) {
    showToast('Failed to create reservation', 'error')
  }
}

const handleApproveReservation = async () => {
  if (!selectedReservation.value) return
  
  try {
    selectedReservation.value.status = 'APPROVED'
    selectedReservation.value.approvedDate = new Date().toISOString().split('T')[0]
    
    showToast('Reservation approved successfully', 'success')
    showApproveModal.value = false
    selectedReservation.value = null
  } catch (error) {
    showToast('Failed to approve reservation', 'error')
  }
}

const handleRejectReservation = async () => {
  if (!selectedReservation.value) return
  
  try {
    selectedReservation.value.status = 'REJECTED'
    selectedReservation.value.rejectedDate = new Date().toISOString().split('T')[0]
    
    if (rejectionReason.value) {
      selectedReservation.value.notes = selectedReservation.value.notes 
        ? `${selectedReservation.value.notes} | Rejection reason: ${rejectionReason.value}`
        : `Rejection reason: ${rejectionReason.value}`
    }
    
    showToast('Reservation rejected successfully', 'success')
    showRejectModal.value = false
    selectedReservation.value = null
    rejectionReason.value = ''
  } catch (error) {
    showToast('Failed to reject reservation', 'error')
  }
}

const handleFulfillReservation = async () => {
  if (!selectedReservation.value) return
  
  try {
    selectedReservation.value.status = 'FULFILLED'
    selectedReservation.value.fulfilledDate = new Date().toISOString().split('T')[0]
    
    showToast('Reservation fulfilled - proceeding to lending workflow', 'success')
    showFulfillModal.value = false
    selectedReservation.value = null
  } catch (error) {
    showToast('Failed to fulfill reservation', 'error')
  }
}

const exportReservations = async (format = 'csv') => {
  try {
    showToast(`Exporting reservations as ${format.toUpperCase()}...`, 'info')
    
    // Simulate export process
    setTimeout(() => {
      showToast('Export completed successfully', 'success')
    }, 2000)
  } catch (error) {
    showToast('Failed to export reservations', 'error')
  }
}

onMounted(() => {
  console.log('Book Reservations Management loaded')
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter">
    <div class="p-6 space-y-8">
      <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
          <h1 class="text-3xl font-bold text-slate-600 dark:text-white flex items-center gap-3">
            <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <BookOpen class="w-5 h-5 text-white" />
            </div>
            Book Reservations
          </h1>
          <p class="mt-2 text-slate-500 dark:text-gray-400">
            Manage reservation requests and queue system for library books
          </p>
      </div>
        <div class="flex gap-3">
          <button
            @click="exportReservations('csv')"
            class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            <Download class="w-5 h-5" />
            Export
          </button>
          <button
            @click="showAddModal = true"
            class="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            <Plus class="w-5 h-5" />
            Manual Reservation
          </button>
        </div>
      </div>

      <!-- Infographics Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <!-- Pending Requests -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Pending Requests</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ pendingCount }}</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Awaiting approval</p>
            </div>
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg" title="Number of pending reservation requests">
              <Mail class="w-5 h-5 text-yellow-600" />
            </div>
      </div>
    </div>

        <!-- Approved Reservations -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Approved</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ approvedCount }}</p>
              <p class="text-xs text-green-600 dark:text-green-400 mt-1">Ready for pickup</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg" title="Number of approved reservations">
              <CheckCircle class="w-5 h-5 text-green-600" />
            </div>
          </div>
    </div>

        <!-- Rejected Requests -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Rejected</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ rejectedCount }}</p>
              <p class="text-xs text-red-600 dark:text-red-400 mt-1">This week</p>
            </div>
            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg" title="Number of rejected reservations">
              <XCircle class="w-5 h-5 text-red-600" />
      </div>
      </div>
    </div>

        <!-- Fulfilled This Week -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
          <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Fulfilled</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ fulfilledThisWeek }}</p>
              <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">This week</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg" title="Number of reservations fulfilled this week">
              <Clock class="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Top Reserved Book -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Most Reserved</p>
              <p class="text-lg font-bold text-slate-600 dark:text-white mt-1">{{ topReservedBook.title }}</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">{{ topReservedBook.count }} requests</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg" title="Most frequently reserved book">
              <TrendingUp class="w-5 h-5 text-purple-600" />
            </div>
        </div>
      </div>
    </div>

      <!-- Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
      </div>
      
        <!-- Tab Content -->
        <div class="p-6">
          <!-- Search and Filters -->
          <div class="flex flex-col lg:flex-row gap-4 mb-6">
            <!-- Search -->
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by student name, book title, or ISBN..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                />
              </div>
              </div>
            
            <!-- Filters -->
            <div class="flex flex-wrap gap-3">
              <select
                v-model="filters.status"
                class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="FULFILLED">Fulfilled</option>
              </select>
              
              <select
                v-model="filters.method"
                class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              >
                <option value="">All Methods</option>
                <option value="MANUAL">Manual</option>
                <option value="SELF_SERVICE">Self Service</option>
                <option value="BARCODE">Barcode</option>
                <option value="GROUP">Group</option>
              </select>
              
              <button
                v-if="filters.status || filters.method || searchQuery"
                @click="clearFilters"
                class="px-4 py-3 text-sm text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-gray-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Reservations List -->
          <div class="space-y-4">
            <div v-for="reservation in filteredReservations" :key="reservation.id" 
                 class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-start gap-4">
                    <div class="flex-1">
                      <h3 class="font-semibold text-slate-600 dark:text-white">{{ reservation.userName }}</h3>
                      <p class="text-sm text-slate-500 dark:text-gray-400">{{ reservation.userType }} • {{ reservation.bookTitle }}</p>
                      <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">ISBN: {{ reservation.isbn }}</p>
                      <p v-if="reservation.notes" class="text-sm text-slate-600 dark:text-gray-300 mt-2">{{ reservation.notes }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div class="text-right">
                    <div class="text-sm text-slate-500 dark:text-gray-400">{{ formatDate(reservation.requestDate) }}</div>
                    <div class="flex gap-2 mt-2">
                      <span :class="getStatusColor(reservation.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ reservation.status }}
              </span>
                      <span :class="getMethodColor(reservation.method)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ formatMethod(reservation.method) }}
                      </span>
                    </div>
              </div>
                  
                  <div v-if="activeTab === 'active'" class="flex gap-2">
                    <button
                      v-if="reservation.status === 'PENDING'"
                      @click="openApproveModal(reservation)"
                      class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                >
                  Approve
                    </button>
                    <button
                      v-if="reservation.status === 'PENDING'"
                      @click="openRejectModal(reservation)"
                      class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      v-if="reservation.status === 'APPROVED'"
                      @click="openFulfillModal(reservation)"
                      class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                >
                  Fulfill
                    </button>
                    <button
                      @click="viewUserHistory(reservation.userId)"
                      class="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                    >
                      History
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="filteredReservations.length === 0" class="text-center py-12">
              <div class="text-slate-500 dark:text-gray-400">No reservations found</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Manual Reservation Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Add Manual Reservation</h3>
            <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">User</label>
              <select
                v-model="newReservation.userId"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Select User</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.type }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Book</label>
              <select
                v-model="newReservation.bookId"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Select Book</option>
                <option v-for="book in books" :key="book.id" :value="book.id">
                  {{ book.title }} ({{ book.availability }} available)
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Notes</label>
              <textarea
                v-model="newReservation.notes"
                rows="3"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Optional notes about the reservation..."
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showAddModal = false"
              class="px-4 py-2 text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleAddReservation"
              class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors"
            >
              Create Reservation
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve Modal -->
    <div v-if="showApproveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Approve Reservation</h3>
            <button @click="showApproveModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>

          <p class="text-slate-600 dark:text-gray-300 mb-6">
            Are you sure you want to approve this reservation for <strong>{{ selectedReservation?.userName }}</strong>?
          </p>

          <div class="flex justify-end gap-3">
            <button
              @click="showApproveModal = false"
              class="px-4 py-2 text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleApproveReservation"
              class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
        </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Reject Reservation</h3>
            <button @click="showRejectModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
        </div>

          <div class="space-y-4">
            <p class="text-slate-600 dark:text-gray-300">
              Rejecting reservation for <strong>{{ selectedReservation?.userName }}</strong>
            </p>

        <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-2">Reason (Optional)</label>
          <textarea
                v-model="rejectionReason"
            rows="3"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Reason for rejection..."
          ></textarea>
            </div>
        </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              @click="showRejectModal = false"
              class="px-4 py-2 text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-gray-100 transition-colors"
          >
            Cancel
            </button>
            <button
              @click="handleRejectReservation"
              class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Fulfill Modal -->
    <div v-if="showFulfillModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Fulfill Reservation</h3>
            <button @click="showFulfillModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>

          <p class="text-slate-600 dark:text-gray-300 mb-6">
            Mark this reservation as fulfilled and proceed to book lending for <strong>{{ selectedReservation?.userName }}</strong>?
          </p>

          <div class="flex justify-end gap-3">
            <button
              @click="showFulfillModal = false"
              class="px-4 py-2 text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-gray-100 transition-colors"
        >
          Cancel
            </button>
            <button
              @click="handleFulfillReservation"
              class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Complete Lending
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User History Modal -->
    <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-lg font-semibold text-slate-600 dark:text-white">Reservation History</h3>
              <p v-if="selectedUser" class="text-sm text-slate-500 dark:text-gray-400">
                {{ selectedUser.name }} ({{ selectedUser.type }}) - {{ selectedUser.email }}
              </p>
            </div>
            <button @click="showHistoryModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div v-if="selectedUser" class="space-y-4">
            <div v-for="reservation in getUserReservations(selectedUser.id)" :key="reservation.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="font-medium text-slate-600 dark:text-white">{{ reservation.bookTitle }}</div>
                  <div class="text-sm text-slate-500 dark:text-gray-400">{{ reservation.isbn }}</div>
                  <div class="text-sm text-slate-500 dark:text-gray-400 mt-1">{{ reservation.notes || 'No notes' }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-slate-500 dark:text-gray-400">{{ formatDate(reservation.requestDate) }}</div>
                  <span 
                    :class="getStatusColor(reservation.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full mt-1 inline-block"
                  >
                    {{ reservation.status }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="getUserReservations(selectedUser.id).length === 0" class="text-center py-8">
              <div class="text-slate-500 dark:text-gray-400">No reservation history found for this user.</div>
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