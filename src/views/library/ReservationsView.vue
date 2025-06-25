<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useBookStore } from '@/stores/library/book'
import { useReservationStore } from '@/stores/library/reservation'
import { useAuthStore } from '@/stores/auth'
import type { Book, BookReservation } from '@/types/library'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import Table from '@/components/ui/table.vue'
import Modal from '@/components/ui/modal.vue'
import Chart from '@/components/ui/chart.vue'
import BarcodeScanner from '@/components/library/BarcodeScanner.vue'
import { useToast } from '@/composables/useToast'

const bookStore = useBookStore()
const reservationStore = useReservationStore()
const authStore = useAuthStore()
const { toast } = useToast()

const reservations = ref<BookReservation[]>([])
const books = ref<Book[]>([])
const selectedBook = ref<Book | null>(null)
const showReserveModal = ref(false)
const showScannerModal = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const studentId = ref('')
const reservationNotes = ref('')
const filterStatus = ref('all')

// Mock reservations data
const mockReservations: BookReservation[] = [
  {
    id: '1',
    bookId: '1',
    bookTitle: 'Advanced Mathematics',
    bookIsbn: '978-0-123456-78-9',
    studentId: 'STU001',
    studentName: 'John Doe',
    studentClass: '10A',
    requestDate: '2024-01-15',
    requestedBy: 'STU001',
    status: 'pending',
    priority: 'normal',
    notes: 'Needed for upcoming exam preparation',
    reservedUntil: '2024-02-15'
  },
  {
    id: '2',
    bookId: '2',
    bookTitle: 'Physics Fundamentals',
    bookIsbn: '978-0-234567-89-0',
    studentId: 'STU002',
    studentName: 'Jane Smith',
    studentClass: '11B',
    requestDate: '2024-01-12',
    requestedBy: 'teacher001',
    status: 'approved',
    priority: 'high',
    notes: 'Required for lab experiments',
    reservedUntil: '2024-02-12',
    approvedBy: 'librarian001',
    approvedDate: '2024-01-13'
  },
  {
    id: '3',
    bookId: '3',
    bookTitle: 'Literature Analysis',
    bookIsbn: '978-0-345678-90-1',
    studentId: 'STU003',
    studentName: 'Mike Johnson',
    studentClass: '12A',
    requestDate: '2024-01-10',
    requestedBy: 'STU003',
    status: 'fulfilled',
    priority: 'normal',
    notes: 'For thesis research',
    reservedUntil: '2024-02-10',
    approvedBy: 'librarian001',
    approvedDate: '2024-01-11',
    fulfilledDate: '2024-01-14'
  },
  {
    id: '4',
    bookId: '4',
    bookTitle: 'World History',
    bookIsbn: '978-0-456789-01-2',
    studentId: 'STU004',
    studentName: 'Sarah Wilson',
    studentClass: '9C',
    requestDate: '2024-01-18',
    requestedBy: 'parent001',
    status: 'rejected',
    priority: 'low',
    notes: 'Book already borrowed by student',
    reservedUntil: '2024-02-18',
    rejectedBy: 'librarian001',
    rejectedDate: '2024-01-19',
    rejectionReason: 'Student already has maximum allowed books'
  },
  {
    id: '5',
    bookId: '5',
    bookTitle: 'Chemistry Basics',
    bookIsbn: '978-0-567890-12-3',
    studentId: 'STU005',
    studentName: 'David Brown',
    studentClass: '10B',
    requestDate: '2024-01-20',
    requestedBy: 'STU005',
    status: 'expired',
    priority: 'normal',
    notes: 'Never picked up',
    reservedUntil: '2024-01-25'
  }
]

// User access control
const userRole = computed(() => authStore.user?.role || 'student')
const canMakeReservation = computed(() => 
  ['student', 'teacher', 'schoolstaff', 'schooladmin', 'admin'].includes(userRole.value)
)
const canApproveReservations = computed(() => 
  ['librarian', 'schoolstaff', 'schooladmin', 'admin'].includes(userRole.value)
)

// Statistics
const reservationStats = computed(() => [
  { label: 'Pending', value: reservations.value.filter(r => r.status === 'pending').length, color: '#F59E0B' },
  { label: 'Approved', value: reservations.value.filter(r => r.status === 'approved').length, color: '#10B981' },
  { label: 'Fulfilled', value: reservations.value.filter(r => r.status === 'fulfilled').length, color: '#3B82F6' },
  { label: 'Rejected', value: reservations.value.filter(r => r.status === 'rejected').length, color: '#EF4444' }
])

const monthlyReservations = computed(() => [
  { label: 'Jan', value: 45 },
  { label: 'Feb', value: 52 },
  { label: 'Mar', value: 38 },
  { label: 'Apr', value: 61 },
  { label: 'May', value: 47 },
  { label: 'Jun', value: 55 }
])

const priorityDistribution = computed(() => {
  const distribution: { [key: string]: number } = {}
  reservations.value.forEach(reservation => {
    distribution[reservation.priority] = (distribution[reservation.priority] || 0) + 1
  })
  return Object.entries(distribution).map(([label, value]) => ({ 
    label: label.charAt(0).toUpperCase() + label.slice(1), 
    value 
  }))
})

const filteredReservations = computed(() => {
  let filtered = reservations.value

  if (searchQuery.value) {
    filtered = filtered.filter(reservation => 
      reservation.bookTitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      reservation.studentName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      reservation.studentClass.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(reservation => reservation.status === filterStatus.value)
  }

  // If user is student, only show their reservations
  if (userRole.value === 'student') {
    filtered = filtered.filter(reservation => reservation.studentId === authStore.user?.id)
  }

  return filtered
})

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredReservations.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => Math.ceil(filteredReservations.value.length / itemsPerPage.value))

const handleCreateReservation = async (scannedStudentId?: string) => {
  const finalStudentId = scannedStudentId || studentId.value
  
  if (!selectedBook.value || !finalStudentId) {
    toast('Please fill in all required fields', 'error')
    return
  }

  try {
    const newReservation: BookReservation = {
      id: Date.now().toString(),
      bookId: selectedBook.value.id,
      bookTitle: selectedBook.value.title,
      bookIsbn: selectedBook.value.isbn,
      studentId: finalStudentId,
      studentName: `Student ${finalStudentId}`, // In real app, would fetch from student store
      studentClass: '10A', // In real app, would fetch from student data
      requestDate: new Date().toISOString().split('T')[0],
      requestedBy: authStore.user?.id || finalStudentId,
      status: 'pending',
      priority: 'normal',
      notes: reservationNotes.value,
      reservedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    }

    reservations.value.unshift(newReservation)
    
    toast('Reservation created successfully', 'success')
    showReserveModal.value = false
    showScannerModal.value = false
    resetForm()
  } catch (error) {
    toast('Failed to create reservation', 'error')
  }
}

const handleApproveReservation = async (reservationId: string) => {
  try {
    const reservation = reservations.value.find(r => r.id === reservationId)
    if (reservation) {
      reservation.status = 'approved'
      reservation.approvedBy = authStore.user?.id
      reservation.approvedDate = new Date().toISOString().split('T')[0]
      toast('Reservation approved', 'success')
    }
  } catch (error) {
    toast('Failed to approve reservation', 'error')
  }
}

const handleRejectReservation = async (reservationId: string, reason: string) => {
  try {
    const reservation = reservations.value.find(r => r.id === reservationId)
    if (reservation) {
      reservation.status = 'rejected'
      reservation.rejectedBy = authStore.user?.id
      reservation.rejectedDate = new Date().toISOString().split('T')[0]
      reservation.rejectionReason = reason
      toast('Reservation rejected', 'success')
    }
  } catch (error) {
    toast('Failed to reject reservation', 'error')
  }
}

const handleFulfillReservation = async (reservationId: string) => {
  try {
    const reservation = reservations.value.find(r => r.id === reservationId)
    if (reservation) {
      reservation.status = 'fulfilled'
      reservation.fulfilledDate = new Date().toISOString().split('T')[0]
      toast('Reservation fulfilled', 'success')
    }
  } catch (error) {
    toast('Failed to fulfill reservation', 'error')
  }
}

const resetForm = () => {
  selectedBook.value = null
  studentId.value = ''
  reservationNotes.value = ''
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'fulfilled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'expired': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'normal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

onMounted(async () => {
  books.value = await bookStore.getBooks()
  reservations.value = mockReservations
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header and Actions -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Book Reservations</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage book reservations and approval workflow</p>
      </div>
      <div class="flex space-x-3">
        <Button 
          v-if="canMakeReservation"
          @click="showScannerModal = true"
          variant="outline"
        >
          Scan Student ID
        </Button>
        <Button 
          v-if="canMakeReservation"
          @click="showReserveModal = true"
          variant="primary"
        >
          New Reservation
        </Button>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Reservation Status Overview -->
      <Chart 
        :data="reservationStats" 
        type="pie" 
        title="Reservation Status" 
      />
      
      <!-- Monthly Reservations -->
      <Chart 
        :data="monthlyReservations" 
        type="bar" 
        title="Monthly Reservations" 
        height="200px"
      />
      
      <!-- Priority Distribution -->
      <Chart 
        :data="priorityDistribution" 
        type="bar" 
        title="Request Priority" 
        height="200px"
      />
    </div>

    <!-- Search and Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          v-model="searchQuery"
          placeholder="Search by book, student, or class..."
          class="md:col-span-2"
        />
        <select 
          v-model="filterStatus"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Total: {{ filteredReservations.length }} reservations
      </div>
    </div>

    <!-- Pending Approvals (for staff/librarians) -->
    <div v-if="canApproveReservations && reservations.filter(r => r.status === 'pending').length > 0" 
         class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
      <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
        Pending Approvals ({{ reservations.filter(r => r.status === 'pending').length }})
      </h3>
      <div class="grid gap-3">
        <div v-for="reservation in reservations.filter(r => r.status === 'pending').slice(0, 3)" 
             :key="reservation.id"
             class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border">
          <div>
            <div class="font-medium text-gray-900 dark:text-gray-100">{{ reservation.bookTitle }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{{ reservation.studentName }} ({{ reservation.studentClass }})</div>
          </div>
          <div class="flex space-x-2">
            <Button size="sm" variant="primary" @click="handleApproveReservation(reservation.id)">
              Approve
            </Button>
            <Button size="sm" variant="outline" @click="handleRejectReservation(reservation.id, 'Manual rejection')">
              Reject
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reservations Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">All Reservations</h2>
      </div>
      
      <Table>
        <template #header>
          <tr>
            <th class="text-left">Book</th>
            <th class="text-left">Student</th>
            <th class="text-left">Request Date</th>
            <th class="text-left">Priority</th>
            <th class="text-left">Status</th>
            <th class="text-left">Notes</th>
            <th class="text-left">Actions</th>
          </tr>
        </template>
        <template #body>
          <tr v-for="reservation in paginatedReservations" :key="reservation.id" class="border-b border-gray-200 dark:border-gray-700">
            <td class="py-3">
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ reservation.bookTitle }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">ISBN: {{ reservation.bookIsbn }}</div>
              </div>
            </td>
            <td class="py-3">
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ reservation.studentName }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ reservation.studentClass }}</div>
              </div>
            </td>
            <td class="py-3">{{ new Date(reservation.requestDate).toLocaleDateString() }}</td>
            <td class="py-3">
              <span
                :class="getPriorityColor(reservation.priority)"
                class="px-2 py-1 rounded-full text-sm font-medium capitalize"
              >
                {{ reservation.priority }}
              </span>
            </td>
            <td class="py-3">
              <span
                :class="getStatusColor(reservation.status)"
                class="px-2 py-1 rounded-full text-sm font-medium capitalize"
              >
                {{ reservation.status }}
              </span>
            </td>
            <td class="py-3">
              <div class="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                {{ reservation.notes || '-' }}
              </div>
            </td>
            <td class="py-3">
              <div class="flex space-x-2">
                <Button
                  v-if="reservation.status === 'pending' && canApproveReservations"
                  variant="primary"
                  size="sm"
                  @click="handleApproveReservation(reservation.id)"
                >
                  Approve
                </Button>
                <Button
                  v-if="reservation.status === 'approved' && canApproveReservations"
                  variant="primary"
                  size="sm"
                  @click="handleFulfillReservation(reservation.id)"
                >
                  Fulfill
                </Button>
                <Button
                  v-if="reservation.status === 'pending' && canApproveReservations"
                  variant="outline"
                  size="sm"
                  @click="handleRejectReservation(reservation.id, 'Manual rejection')"
                >
                  Reject
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

    <!-- New Reservation Modal -->
    <Modal 
      v-if="showReserveModal"
      title="Create New Reservation"
      @close="showReserveModal = false"
    >
      <form @submit.prevent="handleCreateReservation()" class="space-y-4">
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

        <!-- Student ID (only for staff/librarians) -->
        <div v-if="userRole !== 'student'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Student ID
          </label>
          <Input
            v-model="studentId"
            placeholder="Enter student ID"
            required
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            v-model="reservationNotes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Any additional notes for this reservation..."
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            @click="showReserveModal = false"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="!selectedBook || (userRole !== 'student' && !studentId)"
          >
            Create Reservation
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Scanner Modal -->
    <Modal 
      v-if="showScannerModal"
      title="Scan Student ID"
      @close="showScannerModal = false"
    >
      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          Scan a student ID barcode to quickly create a reservation
        </p>
        
        <BarcodeScanner @code-scanned="handleCreateReservation" />
        
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