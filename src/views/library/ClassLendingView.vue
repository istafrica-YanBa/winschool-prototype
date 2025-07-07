<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBookStore } from '@/stores/library/book'
import { useClassStore } from '@/stores/class'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Table from '@/components/ui/table.vue'
import Modal from '@/components/ui/modal.vue'
import DatePicker from '@/components/ui/datepicker.vue'
import Chart from '@/components/ui/chart.vue'
import { useToast } from '@/composables/useToast'
import type { Book, ClassLoan } from '@/types/library'
import { ClassLoanStatus } from '@/types/library'

const bookStore = useBookStore()
const classStore = useClassStore()
const { addToast } = useToast()

const books = ref<Book[]>([])
const classLoans = ref<ClassLoan[]>([])
const selectedBook = ref<Book | null>(null)
const selectedClass = ref('')
const showLendModal = ref(false)
const dueDate = ref('')
const quantity = ref(1)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Mock data for class loans
const mockClassLoans: ClassLoan[] = [
  {
    id: '1',
    classId: '10A',
    bookIds: ['1'],
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: ClassLoanStatus.ACTIVE,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    classId: '11B',
    bookIds: ['2'],
    startDate: '2024-01-10',
    endDate: '2024-03-10',
    status: ClassLoanStatus.ACTIVE,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    classId: '12A',
    bookIds: ['3'],
    startDate: '2024-01-20',
    endDate: '2024-04-20',
    status: ClassLoanStatus.CANCELLED,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: '4',
    classId: '9C',
    bookIds: ['4'],
    startDate: '2024-01-05',
    endDate: '2024-01-25',
    status: ClassLoanStatus.COMPLETED,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  }
]

// Statistics data
const lendingStats = computed(() => [
  { label: 'Active Loans', value: classLoans.value.filter(loan => loan.status === ClassLoanStatus.ACTIVE).length, color: '#10B981' },
  { label: 'Overdue', value: classLoans.value.filter(loan => loan.status === ClassLoanStatus.CANCELLED).length, color: '#EF4444' },
  { label: 'Completed', value: classLoans.value.filter(loan => loan.status === ClassLoanStatus.COMPLETED).length, color: '#3B82F6' },
  { label: 'Total Classes', value: new Set(classLoans.value.map(loan => loan.classId)).size, color: '#8B5CF6' }
])

const booksLentStats = computed(() => [
  { label: 'Jan', value: 75 },
  { label: 'Feb', value: 82 },
  { label: 'Mar', value: 68 },
  { label: 'Apr', value: 91 },
  { label: 'May', value: 77 },
  { label: 'Jun', value: 85 }
])

const classDistribution = computed(() => {
  const distribution: { [key: string]: number } = {}
  classLoans.value.forEach(loan => {
    if (loan.status === ClassLoanStatus.ACTIVE) {
      distribution[loan.classId] = (distribution[loan.classId] || 0) + loan.bookIds.length
    }
  })
  return Object.entries(distribution).map(([label, value]) => ({ label, value }))
})

const filteredLoans = computed(() => {
  if (!searchQuery.value) return classLoans.value
  return classLoans.value.filter(loan => 
    loan.bookIds.length > 0 ||
    loan.classId.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const paginatedLoans = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredLoans.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => Math.ceil(filteredLoans.value.length / itemsPerPage.value))

const classes = computed(() => classStore.classes)

const handleLendBook = async () => {
  if (!selectedBook.value || !selectedClass.value || !dueDate.value) {
    addToast({ message: 'Please fill in all required fields', type: 'error' })
    return
  }

  const selectedClassData = classes.value.find(c => c.id === selectedClass.value)
  if (!selectedClassData) {
    addToast({ message: 'Invalid class selected', type: 'error' })
    return
  }

  try {
    const newLoan: ClassLoan = {
      id: Date.now().toString(),
      classId: selectedClassData.id,
      bookIds: [selectedBook.value.id],
      startDate: dueDate.value,
      endDate: dueDate.value,
      status: ClassLoanStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    classLoans.value.unshift(newLoan)
    
    addToast({ message: 'Books successfully lent to class', type: 'success' })
    showLendModal.value = false
    resetForm()
  } catch (error) {
    addToast({ message: 'Failed to lend books to class', type: 'error' })
  }
}

const handleReturnBooks = async (loanId: string) => {
  try {
    const loanIndex = classLoans.value.findIndex(loan => loan.id === loanId)
    if (loanIndex !== -1) {
      classLoans.value[loanIndex].status = ClassLoanStatus.COMPLETED
      addToast({ message: 'Books marked as returned', type: 'success' })
    }
  } catch (error) {
    addToast({ message: 'Failed to return books', type: 'error' })
  }
}

const resetForm = () => {
  selectedBook.value = null
  selectedClass.value = ''
  dueDate.value = ''
  quantity.value = 1
}

const getStatusColor = (status: ClassLoanStatus) => {
  switch (status) {
    case ClassLoanStatus.ACTIVE: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case ClassLoanStatus.CANCELLED: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case ClassLoanStatus.COMPLETED: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

onMounted(async () => {
  books.value = await bookStore.getBooks({ page: 1, limit: 100, search: '' })
  classLoans.value = mockClassLoans
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header and Action Button -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Class Lending</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage book lending to entire classes</p>
      </div>
      <Button 
        @click="showLendModal = true"
        variant="primary"
      >
        Lend Books to Class
      </Button>
    </div>

    <!-- Statistics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Lending Overview -->
      <Chart 
        :data="lendingStats" 
        type="pie" 
        title="Lending Overview" 
      />
      
      <!-- Monthly Lending Trends -->
      <Chart 
        :data="booksLentStats" 
        type="bar" 
        title="Monthly Books Lent" 
        height="200px"
      />
      
      <!-- Active Class Distribution -->
      <Chart 
        :data="classDistribution" 
        type="bar" 
        title="Books by Active Classes" 
        height="200px"
      />
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row gap-4">
        <Input
          v-model="searchQuery"
          placeholder="Search by book title, class, or teacher..."
          class="flex-1"
        />
        <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          Total: {{ filteredLoans.length }} loans
        </div>
      </div>
    </div>

    <!-- Active Class Loans Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Active Class Loans</h2>
      </div>
      
      <Table>
        <template #header>
          <tr>
            <th class="text-left">Book Details</th>
            <th class="text-left">Class</th>
            <th class="text-left">Teacher</th>
            <th class="text-left">Students</th>
            <th class="text-left">Books Lent</th>
            <th class="text-left">Loan Date</th>
            <th class="text-left">Due Date</th>
            <th class="text-left">Status</th>
            <th class="text-left">Actions</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="loan in paginatedLoans" :key="loan.id" class="border-b border-gray-200 dark:border-gray-700">
            <td class="py-3">
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ loan.bookIds.length > 0 ? loan.bookIds.join(', ') : 'No books' }}</div>
              </div>
            </td>
            <td class="py-3">
              <div class="font-medium text-gray-900 dark:text-gray-100">{{ loan.classId }}</div>
            </td>
            <td class="py-3">
              <div class="text-gray-700 dark:text-gray-300">{{ loan.classId }}</div>
            </td>
            <td class="py-3">
              <div class="text-gray-700 dark:text-gray-300">{{ loan.bookIds.length }}</div>
            </td>
            <td class="py-3">{{ new Date(loan.startDate).toLocaleDateString() }}</td>
            <td class="py-3">{{ new Date(loan.endDate).toLocaleDateString() }}</td>
            <td class="py-3">
              <span
                :class="getStatusColor(loan.status)"
                class="px-2 py-1 rounded-full text-sm font-medium capitalize"
              >
                {{ loan.status }}
              </span>
            </td>
            <td class="py-3">
              <div class="flex space-x-2">
                <Button
                  v-if="loan.status === ClassLoanStatus.ACTIVE"
                  variant="primary"
                  size="sm"
                  @click="handleReturnBooks(loan.id)"
                >
                  Mark Returned
                </Button>
                <Button
                  v-if="loan.status === ClassLoanStatus.CANCELLED"
                  variant="danger"
                  size="sm"
                  @click="handleReturnBooks(loan.id)"
                >
                  Force Return
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

    <!-- Lend Books Modal -->
    <Modal 
      :show="showLendModal"
      title="Lend Books to Class"
      @close="showLendModal = false"
    >
      <form @submit.prevent="handleLendBook" class="space-y-4">
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
              {{ book.title }} (Available: {{ book.status === 'AVAILABLE' ? 'Yes' : 'No' }})
            </option>
          </select>
        </div>

        <!-- Class Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Class
          </label>
          <select 
            v-model="selectedClass"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="">Choose a class...</option>
            <option 
              v-for="classItem in classes" 
              :key="classItem.id" 
              :value="classItem.id"
            >
              {{ classItem.name }} - {{ classItem.teacher }} ({{ classItem.studentCount }} students)
            </option>
          </select>
        </div>

        <!-- Quantity -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Books
          </label>
          <Input
            v-model.number="quantity"
            type="number"
            :min="1"
            :max="selectedBook?.status === 'AVAILABLE' ? 1 : 1"
            required
          />
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
            :disabled="!selectedBook || !selectedClass || !dueDate"
          >
            Lend Books
          </Button>
        </div>
      </form>
    </Modal>
  </div>
</template> 