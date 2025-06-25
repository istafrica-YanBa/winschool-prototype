<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter">
    <div class="p-6 space-y-8">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-slate-600 dark:text-white flex items-center gap-3">
            <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              📚
            </div>
            Course-Based Books
          </h1>
          <p class="mt-2 text-slate-500 dark:text-gray-400">
            Manage book assignments and distribution tied to courses with automated lending
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="exportCourseData({})"
            class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            📥 Export All
          </button>
          <button
            @click="openAssignModal"
            class="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            ➕ Assign Books
          </button>
        </div>
      </div>

      <!-- Infographics Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <!-- Courses With Books -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Courses With Books</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ coursesWithBooks }}</p>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Active assignments</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg" title="Number of courses with book assignments">
              📖
            </div>
          </div>
        </div>

        <!-- Total Students Covered -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Students Covered</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ totalStudentsCovered }}</p>
              <p class="text-xs text-green-600 dark:text-green-400 mt-1">Across all courses</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg" title="Total students covered by course book assignments">
              👥
            </div>
          </div>
        </div>

        <!-- Active Book Assignments -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Book Assignments</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ activeBookAssignments }}</p>
              <p class="text-xs text-purple-600 dark:text-purple-400 mt-1">Currently active</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg" title="Number of active book assignments">
              📋
            </div>
          </div>
        </div>

        <!-- Books Auto-Lended -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Auto-Lended</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ booksAutoLended }}</p>
              <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">Books distributed</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg" title="Number of books automatically lended">
              🔄
            </div>
          </div>
        </div>

        <!-- Missing Books -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500 dark:text-gray-400">Missing Books</p>
              <p class="text-2xl font-bold text-slate-600 dark:text-white mt-1">{{ missingBooks }}</p>
              <p class="text-xs text-red-600 dark:text-red-400 mt-1">Overdue returns</p>
            </div>
            <div class="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg" title="Number of overdue/missing books">
              ⚠️
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by course name, code, or instructor..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          
          <!-- Filters -->
          <div class="flex gap-3">
            <select
              v-model="filterStatus"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
            >
              <option value="all">All Courses</option>
              <option value="auto-enabled">Auto-Lending ON</option>
              <option value="auto-disabled">Auto-Lending OFF</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Courses List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="course in filteredCourses" :key="course.id" 
             class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
          
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-600 dark:text-white">{{ course.name }}</h3>
                <p class="text-sm text-slate-500 dark:text-gray-400">{{ course.code }} • {{ course.semester }}</p>
                <p class="text-sm text-slate-500 dark:text-gray-400">{{ course.instructor }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span :class="course.autoLendingEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'" 
                      class="px-2 py-1 text-xs font-medium rounded-full">
                  Auto: {{ course.autoLendingEnabled ? 'ON' : 'OFF' }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="text-xl font-bold text-slate-600 dark:text-white">{{ course.studentsEnrolled }}</div>
                <div class="text-xs text-slate-500 dark:text-gray-400">Students</div>
              </div>
              <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="text-xl font-bold text-slate-600 dark:text-white">{{ course.booksAssigned }}</div>
                <div class="text-xs text-slate-500 dark:text-gray-400">Books</div>
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <button
                  @click="openCourseDetail(course)"
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                >
                  👁️ View Details
                </button>
                <button
                  @click="toggleAutoLending(course)"
                  :class="course.autoLendingEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'"
                  class="px-3 py-2 text-white text-sm rounded-lg transition-colors"
                >
                  ⚙️
                </button>
              </div>
              
              <div class="flex gap-2">
                <button
                  @click="openBatchLend(course)"
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
                >
                  📦 Batch Lend
                </button>
                <button
                  @click="openBatchReturn(course)"
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors"
                >
                  ↩️ Batch Return
                </button>
              </div>
              
              <button
                @click="exportCourseData(course)"
                class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                📊 Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Assignment Modal -->
      <div v-if="showAssignModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-slate-600 dark:text-white mb-4">Assign Book to Course</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">Course</label>
              <select v-model="newAssignment.courseId" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white">
                <option value="">Select Course</option>
                <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.name }} ({{ course.code }})</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">Book</label>
              <select v-model="newAssignment.bookId" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white">
                <option value="">Select Book</option>
                <option v-for="book in books" :key="book.id" :value="book.id">{{ book.title }}</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">Copies per Student</label>
              <input v-model.number="newAssignment.copiesPerStudent" type="number" min="1" max="5" 
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white">
            </div>
            
            <div class="flex items-center">
              <input v-model="newAssignment.isRequired" type="checkbox" id="isRequired" class="mr-2">
              <label for="isRequired" class="text-sm text-slate-600 dark:text-gray-300">Required Book</label>
            </div>
          </div>
          
          <div class="flex gap-3 mt-6">
            <button @click="showAssignModal = false" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Cancel
            </button>
            <button @click="handleAssignBook" class="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors">
              Assign Book
            </button>
          </div>
        </div>
      </div>

      <!-- Course Detail Modal -->
      <div v-if="showCourseDetailModal && selectedCourse" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-slate-600 dark:text-white">{{ selectedCourse.name }} Details</h3>
            <button @click="showCourseDetailModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
          </div>
          
          <!-- Course Info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="text-sm text-slate-500 dark:text-gray-400">Course Code</div>
              <div class="font-semibold text-slate-600 dark:text-white">{{ selectedCourse.code }}</div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="text-sm text-slate-500 dark:text-gray-400">Instructor</div>
              <div class="font-semibold text-slate-600 dark:text-white">{{ selectedCourse.instructor }}</div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="text-sm text-slate-500 dark:text-gray-400">Students Enrolled</div>
              <div class="font-semibold text-slate-600 dark:text-white">{{ selectedCourse.studentsEnrolled }}</div>
            </div>
          </div>
          
          <!-- Book Assignments -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-slate-600 dark:text-white mb-4">Book Assignments</h4>
            <div class="space-y-3">
              <div v-for="assignment in selectedCourse.bookAssignments" :key="assignment.bookId" 
                   class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex-1">
                  <div class="font-medium text-slate-600 dark:text-white">{{ assignment.bookTitle }}</div>
                  <div class="text-sm text-slate-500 dark:text-gray-400">
                    ISBN: {{ assignment.isbn }} • {{ assignment.copiesPerStudent }} copy per student
                    <span v-if="assignment.isRequired" class="ml-2 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs rounded">Required</span>
                  </div>
                </div>
                <button @click="removeBookAssignment(selectedCourse, assignment.bookId)" 
                        class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Batch Lend Modal -->
      <div v-if="showBatchLendModal && selectedCourse" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-slate-600 dark:text-white mb-4">Batch Lend Books</h3>
          <p class="text-slate-500 dark:text-gray-400 mb-4">
            This will lend all assigned books to all students in {{ selectedCourse.name }}.
          </p>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
            <p class="text-yellow-800 dark:text-yellow-300 text-sm">
              📋 {{ selectedCourse.studentsEnrolled }} students will receive {{ selectedCourse.booksAssigned }} book(s) each.
            </p>
          </div>
          <div class="flex gap-3">
            <button @click="showBatchLendModal = false" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg">
              Cancel
            </button>
            <button @click="handleBatchLend" class="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg">
              Lend All Books
            </button>
          </div>
        </div>
      </div>

      <!-- Batch Return Modal -->
      <div v-if="showBatchReturnModal && selectedCourse" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-slate-600 dark:text-white mb-4">Batch Return Books</h3>
          <p class="text-slate-500 dark:text-gray-400 mb-4">
            This will return all lent books from students in {{ selectedCourse.name }}.
          </p>
          <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4">
            <p class="text-red-800 dark:text-red-300 text-sm">
              ⚠️ This action cannot be undone. All course book lendings will be marked as returned.
            </p>
          </div>
          <div class="flex gap-3">
            <button @click="showBatchReturnModal = false" class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-lg">
              Cancel
            </button>
            <button @click="handleBatchReturn" class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
              Return All Books
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// UI State
const showAssignModal = ref(false)
const showBatchLendModal = ref(false)
const showBatchReturnModal = ref(false)
const showCourseDetailModal = ref(false)
const selectedCourse = ref(null)
const searchQuery = ref('')
const filterStatus = ref('all')

// Form Data
const newAssignment = ref({
  courseId: '',
  bookId: '',
  copiesPerStudent: 1,
  isRequired: true
})

// Mock Data
const courses = ref([
  {
    id: 'C001',
    name: 'Advanced Mathematics',
    code: 'MATH401',
    semester: 'Fall 2024',
    studentsEnrolled: 28,
    booksAssigned: 3,
    autoLendingEnabled: true,
    instructor: 'Dr. Smith',
    bookAssignments: [
      { bookId: 'B001', bookTitle: 'Calculus Fundamentals', isbn: '978-0123456789', copiesPerStudent: 1, isRequired: true, status: 'active' },
      { bookId: 'B002', bookTitle: 'Linear Algebra', isbn: '978-0987654321', copiesPerStudent: 1, isRequired: true, status: 'active' },
      { bookId: 'B003', bookTitle: 'Statistics Guide', isbn: '978-0456789123', copiesPerStudent: 1, isRequired: false, status: 'active' }
    ]
  },
  {
    id: 'C002',
    name: 'Physics Laboratory',
    code: 'PHYS301',
    semester: 'Fall 2024',
    studentsEnrolled: 24,
    booksAssigned: 2,
    autoLendingEnabled: false,
    instructor: 'Prof. Johnson',
    bookAssignments: [
      { bookId: 'B004', bookTitle: 'Physics Lab Manual', isbn: '978-0321654987', copiesPerStudent: 1, isRequired: true, status: 'active' },
      { bookId: 'B005', bookTitle: 'Experiment Procedures', isbn: '978-0654321987', copiesPerStudent: 1, isRequired: true, status: 'active' }
    ]
  },
  {
    id: 'C003',
    name: 'Chemistry Basics',
    code: 'CHEM201',
    semester: 'Fall 2024',
    studentsEnrolled: 35,
    booksAssigned: 1,
    autoLendingEnabled: true,
    instructor: 'Dr. Williams',
    bookAssignments: [
      { bookId: 'B006', bookTitle: 'General Chemistry', isbn: '978-0789456123', copiesPerStudent: 1, isRequired: true, status: 'active' }
    ]
  }
])

const students = ref([
  { id: 'S001', name: 'Emma Thompson', courseId: 'C001', email: 'emma.t@school.edu' },
  { id: 'S002', name: 'James Wilson', courseId: 'C001', email: 'james.w@school.edu' },
  { id: 'S003', name: 'Sofia Garcia', courseId: 'C002', email: 'sofia.g@school.edu' },
  { id: 'S004', name: 'Michael Chen', courseId: 'C002', email: 'michael.c@school.edu' },
  { id: 'S005', name: 'Anna Rodriguez', courseId: 'C003', email: 'anna.r@school.edu' }
])

const bookLendings = ref([
  { id: 'L001', studentId: 'S001', courseId: 'C001', bookId: 'B001', lentDate: '2024-01-15', status: 'lent', dueDate: '2024-05-15' },
  { id: 'L002', studentId: 'S001', courseId: 'C001', bookId: 'B002', lentDate: '2024-01-15', status: 'lent', dueDate: '2024-05-15' },
  { id: 'L003', studentId: 'S002', courseId: 'C001', bookId: 'B001', lentDate: '2024-01-16', status: 'returned', dueDate: '2024-05-15', returnDate: '2024-01-20' }
])

const books = ref([
  { id: 'B001', title: 'Calculus Fundamentals', isbn: '978-0123456789', totalCopies: 50, availableCopies: 22 },
  { id: 'B002', title: 'Linear Algebra', isbn: '978-0987654321', totalCopies: 30, availableCopies: 12 },
  { id: 'B003', title: 'Statistics Guide', isbn: '978-0456789123', totalCopies: 25, availableCopies: 18 },
  { id: 'B004', title: 'Physics Lab Manual', isbn: '978-0321654987', totalCopies: 40, availableCopies: 16 },
  { id: 'B005', title: 'Experiment Procedures', isbn: '978-0654321987', totalCopies: 35, availableCopies: 11 },
  { id: 'B006', title: 'General Chemistry', isbn: '978-0789456123', totalCopies: 45, availableCopies: 10 }
])

// Computed Properties for Infographics
const coursesWithBooks = computed(() => {
  return courses.value.filter(c => c.booksAssigned > 0).length
})

const totalStudentsCovered = computed(() => {
  return courses.value.reduce((sum, course) => sum + course.studentsEnrolled, 0)
})

const activeBookAssignments = computed(() => {
  return courses.value.reduce((sum, course) => sum + course.booksAssigned, 0)
})

const booksAutoLended = computed(() => {
  return bookLendings.value.filter(l => l.status === 'lent').length
})

const missingBooks = computed(() => {
  const now = new Date()
  return bookLendings.value.filter(l => {
    if (l.status !== 'lent') return false
    const dueDate = new Date(l.dueDate)
    return now > dueDate
  }).length
})

// Filtered courses
const filteredCourses = computed(() => {
  let filtered = courses.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      c.instructor.toLowerCase().includes(query)
    )
  }
  
  if (filterStatus.value !== 'all') {
    if (filterStatus.value === 'auto-enabled') {
      filtered = filtered.filter(c => c.autoLendingEnabled)
    } else if (filterStatus.value === 'auto-disabled') {
      filtered = filtered.filter(c => !c.autoLendingEnabled)
    }
  }
  
  return filtered
})

// Utility functions
const getCourseStudents = (courseId) => {
  return students.value.filter(s => s.courseId === courseId)
}

const getStudentLendings = (studentId, courseId) => {
  return bookLendings.value.filter(l => l.studentId === studentId && l.courseId === courseId)
}

const getBookTitle = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  return book ? book.title : 'Unknown Book'
}

const getStatusColor = (status) => {
  const colors = {
    'lent': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'returned': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'overdue': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

// Modal handlers
const openAssignModal = () => {
  newAssignment.value = { courseId: '', bookId: '', copiesPerStudent: 1, isRequired: true }
  showAssignModal.value = true
}

const openCourseDetail = (course) => {
  selectedCourse.value = course
  showCourseDetailModal.value = true
}

const openBatchLend = (course) => {
  selectedCourse.value = course
  showBatchLendModal.value = true
}

const openBatchReturn = (course) => {
  selectedCourse.value = course
  showBatchReturnModal.value = true
}

// Action handlers
const toggleAutoLending = (course) => {
  course.autoLendingEnabled = !course.autoLendingEnabled
  console.log(`Auto-lending ${course.autoLendingEnabled ? 'enabled' : 'disabled'} for ${course.name}`)
}

const handleAssignBook = () => {
  try {
    const course = courses.value.find(c => c.id === newAssignment.value.courseId)
    const book = books.value.find(b => b.id === newAssignment.value.bookId)
    
    if (!course || !book) {
      console.error('Please select both course and book')
      return
    }
    
    const existingAssignment = course.bookAssignments.find(ba => ba.bookId === book.id)
    if (existingAssignment) {
      console.error('Book is already assigned to this course')
      return
    }
    
    const newBookAssignment = {
      bookId: book.id,
      bookTitle: book.title,
      isbn: book.isbn,
      copiesPerStudent: newAssignment.value.copiesPerStudent,
      isRequired: newAssignment.value.isRequired,
      status: 'active'
    }
    
    course.bookAssignments.push(newBookAssignment)
    course.booksAssigned += 1
    
    console.log('Book assigned to course successfully')
    showAssignModal.value = false
  } catch (error) {
    console.error('Failed to assign book')
  }
}

const handleBatchLend = () => {
  if (!selectedCourse.value) return
  
  try {
    const courseStudents = getCourseStudents(selectedCourse.value.id)
    let lentCount = 0
    
    courseStudents.forEach(student => {
      selectedCourse.value.bookAssignments.forEach(assignment => {
        const existingLending = bookLendings.value.find(l => 
          l.studentId === student.id && 
          l.courseId === selectedCourse.value.id && 
          l.bookId === assignment.bookId &&
          l.status === 'lent'
        )
        
        if (!existingLending) {
          const newLending = {
            id: `L${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            studentId: student.id,
            courseId: selectedCourse.value.id,
            bookId: assignment.bookId,
            lentDate: new Date().toISOString().split('T')[0],
            status: 'lent',
            dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
          
          bookLendings.value.push(newLending)
          lentCount++
        }
      })
    })
    
    console.log(`Successfully lent ${lentCount} books to course students`)
    showBatchLendModal.value = false
  } catch (error) {
    console.error('Failed to perform batch lending')
  }
}

const handleBatchReturn = () => {
  if (!selectedCourse.value) return
  
  try {
    const courseLendings = bookLendings.value.filter(l => 
      l.courseId === selectedCourse.value.id && l.status === 'lent'
    )
    
    courseLendings.forEach(lending => {
      lending.status = 'returned'
      lending.returnDate = new Date().toISOString().split('T')[0]
    })
    
    console.log(`Successfully returned ${courseLendings.length} books from course`)
    showBatchReturnModal.value = false
  } catch (error) {
    console.error('Failed to perform batch return')
  }
}

const exportCourseData = (course) => {
  try {
    console.log(`Exporting course data for ${course.name || 'all courses'}...`)
    setTimeout(() => {
      console.log('Course data exported successfully')
    }, 2000)
  } catch (error) {
    console.error('Failed to export course data')
  }
}

const removeBookAssignment = (course, bookId) => {
  const index = course.bookAssignments.findIndex(ba => ba.bookId === bookId)
  if (index > -1) {
    course.bookAssignments.splice(index, 1)
    course.booksAssigned -= 1
    console.log('Book assignment removed')
  }
}

console.log('✅ Course-Based Books Management System loaded successfully!')
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', system-ui, sans-serif;
}
</style> 