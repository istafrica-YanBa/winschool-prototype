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

// Mock data for student loans
const mockStudentLoans: StudentLoan[] = [
  {
    id: '1',
    bookId: '1',
    bookTitle: 'Advanced Mathematics',
    bookIsbn: '978-0-123456-78-9',
    studentId: 'STU001',
    studentName: 'John Doe',
    studentClass: '10A',
    studentEmail: 'john.doe@school.com',
    loanDate: '2024-01-15',
    dueDate: '2024-02-15',
    returnDate: null,
    status: 'active',
    renewCount: 0,
    maxRenewals: 2,
    fineAmount: 0,
    notes: 'First time borrower'
  },
  {
    id: '2',
    bookId: '2',
    bookTitle: 'Physics Fundamentals',
    bookIsbn: '978-0-234567-89-0',
    studentId: 'STU002',
    studentName: 'Jane Smith',
    studentClass: '11B',
    studentEmail: 'jane.smith@school.com',
    loanDate: '2024-01-10',
    dueDate: '2024-02-10',
    returnDate: null,
    status: 'overdue',
    renewCount: 1,
    maxRenewals: 2,
    fineAmount: 15.50,
    notes: 'Student notified about overdue'
  },
  {
    id: '3',
    bookId: '3',
    bookTitle: 'Literature Analysis',
    bookIsbn: '978-0-345678-90-1',
    studentId: 'STU003',
    studentName: 'Mike Johnson',
    studentClass: '12A',
    studentEmail: 'mike.johnson@school.com',
    loanDate: '2024-01-05',
    dueDate: '2024-02-05',
    returnDate: '2024-02-03',
    status: 'returned',
    renewCount: 0,
    maxRenewals: 2,
    fineAmount: 0,
    notes: 'Returned early, excellent condition'
  },
  {
    id: '4',
    bookId: '4',
    bookTitle: 'World History',
    bookIsbn: '978-0-456789-01-2',
    studentId: 'STU004',
    studentName: 'Sarah Wilson',
    studentClass: '9C',
    studentEmail: 'sarah.wilson@school.com',
    loanDate: '2024-01-20',
    dueDate: '2024-02-20',
    returnDate: null,
    status: 'active',
    renewCount: 2,
    maxRenewals: 2,
    fineAmount: 0,
    notes: 'Maximum renewals reached'
  },
  {
    id: '5',
    bookId: '5',
    bookTitle: 'Chemistry Basics',
    bookIsbn: '978-0-567890-12-3',
    studentId: 'STU005',
    studentName: 'David Brown',
    studentClass: '10B',
    studentEmail: 'david.brown@school.com',
    loanDate: '2024-01-12',
    dueDate: '2024-01-20',
    returnDate: null,
    status: 'overdue',
    renewCount: 0,
    maxRenewals: 2,
    fineAmount: 25.00,
    notes: 'Book damaged, fine applied'
  }
]

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

onMounted(async () => {
  books.value = await bookStore.getBooks()
  studentLoans.value = mockStudentLoans
  await studentStore.loadStudents()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header and Actions -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Student Lending</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage individual book loans to students</p>
      </div>
      <div class="flex space-x-3">
        <Button 
          @click="showScannerModal = true"
          variant="outline"
        >
          Scan Student ID
        </Button>
        <Button 
          @click="showLendModal = true"
          variant="primary"
        >
          Lend Book
        </Button>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Lending Status Overview -->
      <Chart 
        :data="lendingStats" 
        type="pie" 
        title="Lending Status Overview" 
      />
      
      <!-- Monthly Loans -->
      <Chart 
        :data="monthlyLoans" 
        type="bar" 
        title="Monthly Student Loans" 
        height="200px"
      />
      
      <!-- Active Loans by Class -->
      <Chart 
        :data="classDistribution" 
        type="bar" 
        title="Active Loans by Class" 
        height="200px"
      />
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ studentLoans.filter(l => l.status === 'active').length }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Active Loans</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-2xl font-bold text-red-600">{{ overdueLoans.length }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Overdue Books</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-2xl font-bold text-green-600">${{ totalFines.toFixed(2) }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Total Fines</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-2xl font-bold text-blue-600">{{ new Set(studentLoans.map(l => l.studentId)).size }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Unique Students</div>
      </div>
    </div>

    <!-- Overdue Alert -->
    <div v-if="overdueLoans.length > 0" 
         class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        ⚠️ Overdue Books ({{ overdueLoans.length }})
      </h3>
      <div class="grid gap-3">
        <div v-for="loan in overdueLoans.slice(0, 3)" 
             :key="loan.id"
             class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border">
          <div>
            <div class="font-medium text-gray-900 dark:text-gray-100">{{ loan.bookTitle }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ loan.studentName }} ({{ loan.studentClass }}) - {{ getDaysOverdue(loan.dueDate) }} days overdue
            </div>
          </div>
          <div class="flex space-x-2">
            <Button size="sm" variant="primary" @click="selectedLoanForReturn = loan; showReturnModal = true">
              Process Return
            </Button>
            <Button size="sm" variant="outline" @click="handleRenewLoan(loan.id)">
              Renew
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          v-model="searchQuery"
          placeholder="Search by book, student, class, or ISBN..."
          class="md:col-span-2"
        />
        <select 
          v-model="filterStatus"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="overdue">Overdue</option>
          <option value="returned">Returned</option>
        </select>
      </div>
      <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Total: {{ filteredLoans.length }} loans
      </div>
    </div>

    <!-- Student Loans Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Student Loans</h2>
      </div>
      
      <Table>
        <template #header>
          <tr>
            <th class="text-left">Book</th>
            <th class="text-left">Student</th>
            <th class="text-left">Loan Date</th>
            <th class="text-left">Due Date</th>
            <th class="text-left">Status</th>
            <th class="text-left">Renewals</th>
            <th class="text-left">Fine</th>
            <th class="text-left">Actions</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="loan in paginatedLoans" :key="loan.id" class="border-b border-gray-200 dark:border-gray-700">
            <td class="py-3">
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ loan.bookTitle }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">ISBN: {{ loan.bookIsbn }}</div>
              </div>
            </td>
            <td class="py-3">
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ loan.studentName }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ loan.studentClass }}</div>
              </div>
            </td>
            <td class="py-3">{{ new Date(loan.loanDate).toLocaleDateString() }}</td>
            <td class="py-3">
              <div>
                {{ new Date(loan.dueDate).toLocaleDateString() }}
                <div v-if="loan.status === 'overdue'" class="text-xs text-red-600 dark:text-red-400">
                  {{ getDaysOverdue(loan.dueDate) }} days overdue
                </div>
              </div>
            </td>
            <td class="py-3">
              <span
                :class="getStatusColor(loan.status)"
                class="px-2 py-1 rounded-full text-sm font-medium capitalize"
              >
                {{ loan.status }}
              </span>
            </td>
            <td class="py-3">
              <div class="text-sm">
                {{ loan.renewCount }}/{{ loan.maxRenewals }}
              </div>
            </td>
            <td class="py-3">
              <div class="font-medium" :class="loan.fineAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'">
                ${{ loan.fineAmount.toFixed(2) }}
              </div>
            </td>
            <td class="py-3">
              <div class="flex space-x-2">
                <Button
                  v-if="loan.status === 'active' || loan.status === 'overdue'"
                  variant="primary"
                  size="sm"
                  @click="selectedLoanForReturn = loan; showReturnModal = true"
                >
                  Return
                </Button>
                <Button
                  v-if="(loan.status === 'active' || loan.status === 'overdue') && loan.renewCount < loan.maxRenewals"
                  variant="outline"
                  size="sm"
                  @click="handleRenewLoan(loan.id)"
                >
                  Renew
                </Button>
              </div>
            </td>
          </tr>
        </template>
      </Table>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <div class="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lend Book Modal -->
    <Modal 
      v-if="showLendModal"
      title="Lend Book to Student"
      @close="showLendModal = false"
    >
      <form @submit.prevent="handleLendBook()" class="space-y-4">
        <!-- Book Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Book
          </label>
          <select 
            v-model="selectedBook"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="">Choose a book...</option>
            <option 
              v-for="book in books" 
              :key="book.id" 
              :value="book"
            >
              {{ book.title }} (Available: {{ book.availableCopies }})
            </option>
          </select>
        </div>

        <!-- Student Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Student
          </label>
          <select 
            v-model="selectedStudent"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="">Choose a student...</option>
            <option 
              v-for="student in students" 
              :key="student.id" 
              :value="student.id"
            >
              {{ student.name }} - {{ student.class }}
            </option>
          </select>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date
          </label>
          <DatePicker
            v-model="dueDate"
            required
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            @click="showLendModal = false"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="!selectedBook || !selectedStudent || !dueDate"
          >
            Lend Book
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Return Book Modal -->
    <Modal 
      v-if="showReturnModal && selectedLoanForReturn"
      title="Return Book"
      @close="showReturnModal = false; selectedLoanForReturn = null"
    >
      <div class="space-y-4">
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-2">Loan Details</h3>
          <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <div><strong>Book:</strong> {{ selectedLoanForReturn.bookTitle }}</div>
            <div><strong>Student:</strong> {{ selectedLoanForReturn.studentName }}</div>
            <div><strong>Due Date:</strong> {{ new Date(selectedLoanForReturn.dueDate).toLocaleDateString() }}</div>
            <div v-if="selectedLoanForReturn.status === 'overdue'" class="text-red-600 dark:text-red-400">
              <strong>Days Overdue:</strong> {{ getDaysOverdue(selectedLoanForReturn.dueDate) }}
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <Button
            variant="outline"
            @click="showReturnModal = false; selectedLoanForReturn = null"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            @click="handleReturnBook"
          >
            Process Return
          </Button>
        </div>
      </div>
    </Modal>

    <!-- Scanner Modal -->
    <Modal 
      v-if="showScannerModal"
      title="Scan Student ID"
      @close="showScannerModal = false"
    >
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          Scan a student ID barcode to quickly lend a book
        </p>
        
        <BarcodeScanner @code-scanned="handleLendBook" />
        
        <Button
          variant="outline"
          @click="showScannerModal = false"
          class="w-full"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  </div>
</template> 