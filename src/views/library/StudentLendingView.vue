<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBookStore } from '@/stores/library/book'
import { useLoanStore } from '@/stores/library/loan'
import { useStudentStore } from '@/stores/student'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Table from '@/components/ui/table.vue'
import Modal from '@/components/ui/modal.vue'
import DatePicker from '@/components/ui/datepicker.vue'
import Chart from '@/components/ui/chart.vue'
import BarcodeScanner from '@/components/library/BarcodeScanner.vue'
import { useToast } from '@/composables/useToast'
import type { Book, StudentLoan } from '@/types/library'
import { 
  BookOpen, Users, GraduationCap, Building, 
  AlertCircle, Calendar, Search, Plus, RotateCcw, 
  Eye, Filter, Clock, User, Book
} from 'lucide-vue-next'

const bookStore = useBookStore()
const loanStore = useLoanStore()
const studentStore = useStudentStore()
const { toast } = useToast()

const books = ref<Book[]>([])
const studentLoans = ref<StudentLoan[]>([])
const selectedBook = ref<Book | null>(null)
const selectedStudent = ref('')
const showLendModal = ref(false)
const showReturnModal = ref(false)
const showScannerModal = ref(false)
const dueDate = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const filterStatus = ref('all')
const selectedLoanForReturn = ref<StudentLoan | null>(null)

// Active tab management
const activeTab = ref('student')

// UI State
const isLoading = ref(false)
const isMobile = ref(false)
const showLendingModal = ref(false)
const showTakeBackModal = ref(false)
const selectedLending = ref(null)

// Mock lending data
const lendings = ref([
  // Student Lendings
  {
    id: 1,
    type: 'student',
    borrowerName: 'Max Mueller',
    borrowerId: 'STU001',
    bookTitle: 'Advanced Mathematics',
    bookId: 'BK001',
    isbn: '978-3-16-148410-0',
    dateBorrowed: '2024-03-01',
    dueDate: '2024-03-31',
    status: 'active',
    notes: 'For semester project'
  },
  {
    id: 2,
    type: 'student',
    borrowerName: 'Anna Schmidt',
    borrowerId: 'STU002',
    bookTitle: 'German Literature',
    bookId: 'BK002',
    isbn: '978-3-16-148411-7',
    dateBorrowed: '2024-02-15',
    dueDate: '2024-03-15',
    status: 'overdue',
    notes: 'Research material'
  },
  // Staff Lendings
  {
    id: 3,
    type: 'staff',
    borrowerName: 'Dr. Weber',
    borrowerId: 'STF001',
    bookTitle: 'Modern Physics',
    bookId: 'BK003',
    isbn: '978-3-16-148412-4',
    dateBorrowed: '2024-03-10',
    dueDate: '2024-04-10',
    status: 'active',
    notes: 'Teaching reference'
  },
  // Class Lendings
  {
    id: 4,
    type: 'class',
    borrowerName: 'Class 10A',
    borrowerId: 'CLS001',
    bookTitle: 'Chemistry Basics',
    bookId: 'BK004',
    isbn: '978-3-16-148413-1',
    dateBorrowed: '2024-03-05',
    dueDate: '2024-04-05',
    status: 'active',
    notes: 'Class set for experiments'
  },
  // Course Lendings
  {
    id: 5,
    type: 'course',
    borrowerName: 'Mathematics Course',
    borrowerId: 'CRS001',
    bookTitle: 'Calculus Textbook',
    bookId: 'BK005',
    isbn: '978-3-16-148414-8',
    dateBorrowed: '2024-02-20',
    dueDate: '2024-05-20',
    status: 'active',
    notes: 'Semester textbook'
  }
])

// New lending form
const newLending = ref({
  type: 'student',
  borrowerId: '',
  borrowerName: '',
  bookId: '',
  bookTitle: '',
  isbn: '',
  dateBorrowed: new Date().toISOString().split('T')[0],
  dueDate: '',
  notes: ''
})

// Statistics
const lendingStats = computed(() => [
  { label: 'Active Loans', value: studentLoans.value.filter(loan => loan.status === 'active').length, color: '#10B981' },
  { label: 'Overdue', value: studentLoans.value.filter(loan => loan.status === 'overdue').length, color: '#EF4444' },
  { label: 'Returned', value: studentLoans.value.filter(loan => loan.status === 'returned').length, color: '#3B82F6' },
  { label: 'Total Students', value: new Set(studentLoans.value.map(loan => loan.studentId)).size, color: '#8B5CF6' }
])

const monthlyLoans = computed(() => [
  { label: 'Jan', value: 125 },
  { label: 'Feb', value: 138 },
  { label: 'Mar', value: 112 },
  { label: 'Apr', value: 145 },
  { label: 'May', value: 132 },
  { label: 'Jun', value: 149 }
])

const classDistribution = computed(() => {
  const distribution: { [key: string]: number } = {}
  studentLoans.value.forEach(loan => {
    if (loan.status === 'active') {
      distribution[loan.studentClass] = (distribution[loan.studentClass] || 0) + 1
    }
  })
  return Object.entries(distribution).map(([label, value]) => ({ label, value }))
})

const totalFines = computed(() => {
  return studentLoans.value.reduce((total, loan) => total + loan.fineAmount, 0)
})

const overdueLoans = computed(() => {
  return studentLoans.value.filter(loan => loan.status === 'overdue')
})

const filteredLoans = computed(() => {
  let filtered = studentLoans.value

  if (searchQuery.value) {
    filtered = filtered.filter(loan => 
      loan.bookTitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loan.studentName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loan.studentClass.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      loan.bookIsbn.includes(searchQuery.value)
    )
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(loan => loan.status === filterStatus.value)
  }

  return filtered
})

const paginatedLoans = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredLoans.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => Math.ceil(filteredLoans.value.length / itemsPerPage.value))

const students = computed(() => studentStore.students)

const handleLendBook = async (scannedStudentId?: string) => {
  const finalStudentId = scannedStudentId || selectedStudent.value
  
  if (!selectedBook.value || !finalStudentId || !dueDate.value) {
    toast('Please fill in all required fields', 'error')
    return
  }

  const student = students.value.find(s => s.id === finalStudentId)
  if (!student) {
    toast('Invalid student selected', 'error')
    return
  }

  try {
    const newLoan: StudentLoan = {
      id: Date.now().toString(),
      bookId: selectedBook.value.id,
      bookTitle: selectedBook.value.title,
      bookIsbn: selectedBook.value.isbn,
      studentId: student.id,
      studentName: student.name,
      studentClass: student.class,
      studentEmail: student.email,
      loanDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.value,
      returnDate: null,
      status: 'active',
      renewCount: 0,
      maxRenewals: 2,
      fineAmount: 0,
      notes: `Book lent to ${student.name}`
    }

    studentLoans.value.unshift(newLoan)
    
    toast('Book successfully lent to student', 'success')
    showLendModal.value = false
    showScannerModal.value = false
    resetForm()
  } catch (error) {
    toast('Failed to lend book to student', 'error')
  }
}

const handleReturnBook = async () => {
  if (!selectedLoanForReturn.value) return

  try {
    const loan = studentLoans.value.find(l => l.id === selectedLoanForReturn.value!.id)
    if (loan) {
      loan.status = 'returned'
      loan.returnDate = new Date().toISOString().split('T')[0]
      
      // Calculate fine if overdue
      const dueDate = new Date(loan.dueDate)
      const returnDate = new Date()
      if (returnDate > dueDate) {
        const overdueDays = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        loan.fineAmount = overdueDays * 1.50 // $1.50 per day
      }
      
      toast('Book returned successfully', 'success')
      showReturnModal.value = false
      selectedLoanForReturn.value = null
    }
  } catch (error) {
    toast('Failed to return book', 'error')
  }
}

const handleRenewLoan = async (loanId: string) => {
  try {
    const loan = studentLoans.value.find(l => l.id === loanId)
    if (loan && loan.renewCount < loan.maxRenewals) {
      loan.renewCount++
      const currentDueDate = new Date(loan.dueDate)
      currentDueDate.setDate(currentDueDate.getDate() + 14) // Add 2 weeks
      loan.dueDate = currentDueDate.toISOString().split('T')[0]
      
      toast('Loan renewed successfully', 'success')
    } else {
      toast('Maximum renewals reached', 'error')
    }
  } catch (error) {
    toast('Failed to renew loan', 'error')
  }
}

const resetForm = () => {
  selectedBook.value = null
  selectedStudent.value = ''
  dueDate.value = ''
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'returned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getDaysOverdue = (dueDate: string) => {
  const due = new Date(dueDate)
  const today = new Date()
  if (today > due) {
    return Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  }
  return 0
}

// Computed metrics for infographics
const totalActiveLendings = computed(() => 
  lendings.value.filter(l => l.status === 'active').length
)

const studentLendings = computed(() => 
  lendings.value.filter(l => l.type === 'student').length
)

const staffLendings = computed(() => 
  lendings.value.filter(l => l.type === 'staff').length
)

const classLendings = computed(() => 
  lendings.value.filter(l => l.type === 'class').length
)

const courseLendings = computed(() => 
  lendings.value.filter(l => l.type === 'course').length
)

const overdueReturns = computed(() => 
  lendings.value.filter(l => l.status === 'overdue').length
)

// Filtered lendings by active tab
const filteredLendings = computed(() => {
  let filtered = lendings.value.filter(l => l.type === activeTab.value)
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(l => 
      l.borrowerName.toLowerCase().includes(query) ||
      l.bookTitle.toLowerCase().includes(query) ||
      l.isbn.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Paginated lendings
const paginatedLendings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredLendings.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => 
  Math.ceil(filteredLendings.value.length / itemsPerPage.value)
)

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE')
}

const getDaysUntilDue = (dueDate) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Active'
    case 'overdue': return 'Overdue'
    case 'returned': return 'Returned'
    default: return status
  }
}

const openLendingModal = () => {
  newLending.value.type = activeTab.value
  showLendingModal.value = true
}

const openTakeBackModal = (lending) => {
  selectedLending.value = lending
  showTakeBackModal.value = true
}

const handleNewLending = async () => {
  try {
    isLoading.value = true
    
    const lending = {
      id: lendings.value.length + 1,
      ...newLending.value,
      status: 'active'
    }
    
    lendings.value.push(lending)
    toast('Book lent successfully!', 'success')
    showLendingModal.value = false
    resetLendingForm()
  } catch (error) {
    toast('Failed to lend book', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleTakeBack = async () => {
  try {
    isLoading.value = true
    
    const index = lendings.value.findIndex(l => l.id === selectedLending.value.id)
    if (index !== -1) {
      lendings.value[index].status = 'returned'
      toast('Book returned successfully!', 'success')
      showTakeBackModal.value = false
    }
  } catch (error) {
    toast('Failed to process return', 'error')
  } finally {
    isLoading.value = false
  }
}

const resetLendingForm = () => {
  newLending.value = {
    type: activeTab.value,
    borrowerId: '',
    borrowerName: '',
    bookId: '',
    bookTitle: '',
    isbn: '',
    dateBorrowed: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const getTabIcon = (tabName) => {
  switch (tabName) {
    case 'student': return User
    case 'staff': return GraduationCap
    case 'class': return Users
    case 'course': return Building
    default: return Book
  }
}

onMounted(async () => {
  books.value = await bookStore.getBooks()
  studentLoans.value = mockStudentLoans
  await studentStore.loadStudents()
  checkMobile()
  window.addEventListener('resize', checkMobile)
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
            Book Lending
          </h1>
          <p class="text-slate-500 dark:text-gray-400 mt-2">
            Manage book lending operations and track borrowed books
          </p>
        </div>
      </div>

      <!-- Infographics Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <!-- Total Active Lendings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Total Active</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ totalActiveLendings }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen class="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Student Lendings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Students</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ studentLendings }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <User class="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Staff Lendings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Staff</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ staffLendings }}</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <GraduationCap class="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Class Lendings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Classes</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ classLendings }}</p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Users class="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Course Lendings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Courses</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ courseLendings }}</p>
            </div>
            <div class="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Building class="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <!-- Overdue Returns -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Overdue</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ overdueReturns }}</p>
            </div>
            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle class="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tabbed View -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in ['student', 'staff', 'class', 'course']"
              :key="tab"
              @click="activeTab = tab; currentPage = 1"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2',
                activeTab === tab
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              <component :is="getTabIcon(tab)" class="w-4 h-4" />
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }} Lending
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Controls -->
          <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <!-- Search Bar -->
            <div class="relative flex-1 max-w-md">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by borrower, book title, or ISBN..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              />
            </div>

            <!-- New Lending Button -->
            <button
              @click="openLendingModal"
              class="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <Plus class="w-5 h-5" />
              Lend New Book
            </button>
          </div>

          <!-- Desktop Table View -->
          <div v-if="!isMobile" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Borrower</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Book</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">ISBN</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Borrowed</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="lending in paginatedLendings" :key="lending.id" class="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-slate-600 dark:text-white">{{ lending.borrowerName }}</div>
                    <div class="text-xs text-slate-400 dark:text-gray-400">ID: {{ lending.borrowerId }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-slate-600 dark:text-white">{{ lending.bookTitle }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300 font-mono">
                    {{ lending.isbn }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300">
                    {{ formatDate(lending.dateBorrowed) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-gray-300">
                    <div>{{ formatDate(lending.dueDate) }}</div>
                    <div v-if="lending.status === 'active'" :class="[
                      'text-xs',
                      getDaysUntilDue(lending.dueDate) < 0 ? 'text-red-600' : 
                      getDaysUntilDue(lending.dueDate) <= 3 ? 'text-yellow-600' : 'text-green-600'
                    ]">
                      {{ getDaysUntilDue(lending.dueDate) < 0 ? 
                        `${Math.abs(getDaysUntilDue(lending.dueDate))} days overdue` :
                        `${getDaysUntilDue(lending.dueDate)} days left`
                      }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(lending.status)
                    ]">
                      {{ getStatusText(lending.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      v-if="lending.status !== 'returned'"
                      @click="openTakeBackModal(lending)"
                      class="inline-flex items-center px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <RotateCcw class="w-4 h-4 mr-1" />
                      Take Back
                    </button>
                    <button
                      class="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Eye class="w-4 h-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Card View -->
          <div v-else class="space-y-4">
            <div
              v-for="lending in paginatedLendings"
              :key="lending.id"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                  <h3 class="font-semibold text-slate-600 dark:text-white text-lg">{{ lending.borrowerName }}</h3>
                  <p class="text-slate-500 dark:text-gray-400 text-sm">{{ lending.bookTitle }}</p>
                </div>
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(lending.status)
                ]">
                  {{ getStatusText(lending.status) }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-gray-400 mb-4">
                <div><span class="font-medium">ISBN:</span> {{ lending.isbn }}</div>
                <div><span class="font-medium">Borrowed:</span> {{ formatDate(lending.dateBorrowed) }}</div>
                <div><span class="font-medium">Due:</span> {{ formatDate(lending.dueDate) }}</div>
                <div><span class="font-medium">ID:</span> {{ lending.borrowerId }}</div>
              </div>
              
              <div class="flex gap-2">
                <button
                  v-if="lending.status !== 'returned'"
                  @click="openTakeBackModal(lending)"
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors text-sm"
                >
                  <RotateCcw class="w-4 h-4" />
                  Take Back
                </button>
                <button
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm"
                >
                  <Eye class="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredLendings.length === 0" class="text-center py-12">
            <BookOpen class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-slate-600 dark:text-white mb-2">
              No {{ activeTab }} lendings found
            </h3>
            <p class="text-slate-500 dark:text-gray-400 mb-6">
              {{ searchQuery ? 'Try adjusting your search terms.' : 'Start lending books to see them here.' }}
            </p>
            <button
              @click="openLendingModal"
              class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium"
            >
              <Plus class="w-5 h-5" />
              Lend New Book
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
            <div class="text-sm text-slate-500 dark:text-gray-400">
              Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredLendings.length) }} of {{ filteredLendings.length }} results
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

    <!-- New Lending Modal -->
    <div v-if="showLendingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-slate-600 dark:text-white">New {{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }} Lending</h3>
          <p class="text-slate-500 dark:text-gray-400 mt-1">Assign a book to a {{ activeTab }}</p>
        </div>
        
        <form @submit.prevent="handleNewLending" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Borrower Selection -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-600 dark:text-gray-300 mb-2">{{ activeTab.charAt(0).toUpperCase() + activeTab.slice(1) }} *</label>
              <div class="flex gap-2">
                <input
                  v-model="newLending.borrowerName"
                  type="text"
                  required
                  class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  :placeholder="`Enter ${activeTab} name`"
                />
                <input
                  v-model="newLending.borrowerId"
                  type="text"
                  required
                  class="w-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="ID"
                />
              </div>
            </div>

            <!-- Book Selection -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-600 dark:text-gray-300 mb-2">Book *</label>
              <div class="flex gap-2">
                <input
                  v-model="newLending.bookTitle"
                  type="text"
                  required
                  class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="Search book title"
                />
                <input
                  v-model="newLending.isbn"
                  type="text"
                  class="w-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="ISBN"
                />
              </div>
            </div>

            <!-- Lending Date -->
            <div>
              <label class="block text-sm font-semibold text-slate-600 dark:text-gray-300 mb-2">Lending Date *</label>
              <input
                v-model="newLending.dateBorrowed"
                type="date"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              />
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-sm font-semibold text-slate-600 dark:text-gray-300 mb-2">Due Date *</label>
              <input
                v-model="newLending.dueDate"
                type="date"
                required
                :min="newLending.dateBorrowed"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              />
            </div>

            <!-- Notes -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-600 dark:text-gray-300 mb-2">Notes</label>
              <textarea
                v-model="newLending.notes"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                placeholder="Optional notes about this lending..."
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="showLendingModal = false; resetLendingForm()"
              class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <BookOpen class="w-5 h-5" />
              {{ isLoading ? 'Processing...' : 'Lend Book' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Take Back Modal -->
    <div v-if="showTakeBackModal && selectedLending" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-bold text-slate-600 dark:text-white">Return Book</h3>
          <p class="text-slate-500 dark:text-gray-400 mt-1">Process book return</p>
        </div>
        
        <div class="p-6">
          <div class="space-y-4">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 class="font-semibold text-slate-600 dark:text-white">{{ selectedLending.bookTitle }}</h4>
              <p class="text-slate-500 dark:text-gray-400">Borrowed by: {{ selectedLending.borrowerName }}</p>
              <p class="text-sm text-slate-400 dark:text-gray-400">Due: {{ formatDate(selectedLending.dueDate) }}</p>
            </div>
            
            <div class="text-center">
              <p class="text-slate-600 dark:text-gray-300">
                Are you sure you want to process the return of this book?
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              type="button"
              @click="showTakeBackModal = false"
              class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              @click="handleTakeBack"
              :disabled="isLoading"
              class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <RotateCcw class="w-5 h-5" />
              {{ isLoading ? 'Processing...' : 'Return Book' }}
            </button>
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