<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { 
  BookOpen, Users, GraduationCap, Building, 
  AlertCircle, Calendar, Search, Plus, RotateCcw, 
  Eye, Filter, Clock, User, Book, X, Check
} from 'lucide-vue-next'

const { showToast } = useToast()

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
  {
    id: 3,
    type: 'student',
    borrowerName: 'Lisa Wagner',
    borrowerId: 'STU003',
    bookTitle: 'Biology Textbook',
    bookId: 'BK006',
    isbn: '978-3-16-148415-5',
    dateBorrowed: '2024-03-05',
    dueDate: '2024-04-05',
    status: 'active',
    notes: 'Class assignment'
  },
  // Staff Lendings
  {
    id: 4,
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
  {
    id: 5,
    type: 'staff',
    borrowerName: 'Prof. Meyer',
    borrowerId: 'STF002',
    bookTitle: 'Educational Psychology',
    bookId: 'BK007',
    isbn: '978-3-16-148416-2',
    dateBorrowed: '2024-02-28',
    dueDate: '2024-03-20',
    status: 'overdue',
    notes: 'Research project'
  },
  // Class Lendings
  {
    id: 6,
    type: 'class',
    borrowerName: 'Class 10A',
    borrowerId: 'CLS001',
    bookTitle: 'Chemistry Basics',
    bookId: 'BK004',
    isbn: '978-3-16-148413-1',
    dateBorrowed: '2024-03-05',
    dueDate: '2024-04-05',
    status: 'active',
    copies: 25,
    notes: 'Class set for experiments'
  },
  {
    id: 7,
    type: 'class',
    borrowerName: 'Class 9B',
    borrowerId: 'CLS002',
    bookTitle: 'History Atlas',
    bookId: 'BK008',
    isbn: '978-3-16-148417-9',
    dateBorrowed: '2024-03-12',
    dueDate: '2024-04-12',
    status: 'active',
    copies: 30,
    notes: 'Geography project'
  },
  // Course Lendings
  {
    id: 8,
    type: 'course',
    borrowerName: 'Mathematics Course',
    borrowerId: 'CRS001',
    bookTitle: 'Calculus Textbook',
    bookId: 'BK005',
    isbn: '978-3-16-148414-8',
    dateBorrowed: '2024-02-20',
    dueDate: '2024-05-20',
    status: 'active',
    copies: 45,
    notes: 'Semester textbook'
  },
  {
    id: 9,
    type: 'course',
    borrowerName: 'Physics Course',
    borrowerId: 'CRS002',
    bookTitle: 'Quantum Mechanics',
    bookId: 'BK009',
    isbn: '978-3-16-148418-6',
    dateBorrowed: '2024-03-01',
    dueDate: '2024-06-01',
    status: 'active',
    copies: 20,
    notes: 'Advanced physics course'
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
  copies: 1,
  notes: ''
})

// Search and filter
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

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

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
    case 'overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
    case 'returned': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
    default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
  }
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
  // Reset copies to 1 for individual lending (student/staff) or set appropriate default for group lending
  newLending.value.copies = (activeTab.value === 'class' || activeTab.value === 'course') ? 1 : 1
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
    const copiesText = (lending.type === 'class' || lending.type === 'course') && lending.copies > 1 
      ? ` (${lending.copies} copies)` 
      : ''
    showToast(`Book lent successfully${copiesText}!`, 'success')
    showLendingModal.value = false
    resetLendingForm()
  } catch (error) {
    showToast('Failed to lend book', 'error')
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
      showToast('Book returned successfully!', 'success')
      showTakeBackModal.value = false
    }
  } catch (error) {
    showToast('Failed to process return', 'error')
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
    copies: 1,
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

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// Add student list and search modal state
const showStudentSelectModal = ref(false)
const studentSearch = ref('')
const students = ref([
  { id: 'STU001', name: 'Max Mueller', class: '10A', avatar: '', email: 'max.mueller@example.com' },
  { id: 'STU002', name: 'Anna Schmidt', class: '9B', avatar: '', email: 'anna.schmidt@example.com' },
  { id: 'STU003', name: 'Lisa Wagner', class: '10A', avatar: '', email: 'lisa.wagner@example.com' },
  { id: 'STU004', name: 'Tom Becker', class: '8C', avatar: '', email: 'tom.becker@example.com' }
])
const filteredStudents = computed(() => {
  const q = studentSearch.value.toLowerCase()
  return students.value.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.class.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q)
  )
})
const selectedStudent = ref(null)
const lendingMode = ref(false)

function openStudentSelect() {
  lendingMode.value = true
  showStudentSelectModal.value = false
  studentSearch.value = ''
  selectedStudent.value = null
}

function cancelLendingMode() {
  lendingMode.value = false
  selectedStudent.value = null
}

function selectStudent(student) {
  selectedStudent.value = student
  showStudentSelectModal.value = false
  openLendingModalWithStudent(student)
}

function openLendingModalWithStudent(student) {
  newLending.value.type = 'student'
  newLending.value.borrowerId = student.id
  newLending.value.borrowerName = student.name
  newLending.value.class = student.class
  showLendingModal.value = true
}

// For scan/manual book entry
const scanInput = ref('')
const scanInputRef = ref(null)
function focusScanInput() {
  nextTick(() => scanInputRef.value && scanInputRef.value.focus())
}

// For take back modal receipt type
const receiptType = ref('standard')

// Add mock data for staff, classes, and courses
const staff = ref([
  { id: 'STF001', name: 'Dr. Weber', department: 'Physics', avatar: '', email: 'weber@example.com' },
  { id: 'STF002', name: 'Prof. Meyer', department: 'Psychology', avatar: '', email: 'meyer@example.com' }
])
const classes = ref([
  { id: 'CLS001', name: 'Class 10A', year: '2024', avatar: '' },
  { id: 'CLS002', name: 'Class 9B', year: '2024', avatar: '' }
])
const courses = ref([
  { id: 'CRS001', name: 'Mathematics Course', code: 'MATH2024', avatar: '' },
  { id: 'CRS002', name: 'Physics Course', code: 'PHYS2024', avatar: '' }
])

// Dynamic search and selection
const searchList = computed(() => {
  if (activeTab.value === 'student') return students.value
  if (activeTab.value === 'staff') return staff.value
  if (activeTab.value === 'class') return classes.value
  if (activeTab.value === 'course') return courses.value
  return []
})
const filteredSearchList = computed(() => {
  const q = studentSearch.value.toLowerCase()
  if (activeTab.value === 'student') {
    return students.value.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.class.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    )
  } else if (activeTab.value === 'staff') {
    return staff.value.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    )
  } else if (activeTab.value === 'class') {
    return classes.value.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    )
  } else if (activeTab.value === 'course') {
    return courses.value.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    )
  }
  return []
})
function selectEntity(entity) {
  selectedStudent.value = entity
  showStudentSelectModal.value = false
  openLendingModalWithEntity(entity)
}
function openLendingModalWithEntity(entity) {
  if (activeTab.value === 'class' || activeTab.value === 'course') {
    openClassCourseModal(entity)
  } else {
    newLending.value.type = activeTab.value
    if (activeTab.value === 'student') {
      newLending.value.borrowerId = entity.id
      newLending.value.borrowerName = entity.name
      newLending.value.class = entity.class
    } else if (activeTab.value === 'staff') {
      newLending.value.borrowerId = entity.id
      newLending.value.borrowerName = entity.name
      newLending.value.department = entity.department
    }
    showLendingModal.value = true
  }
}

// Add mock data for available books and students in classes/courses
const availableBooks = ref([
  { id: 'BK001', title: 'Mathematics Textbook', author: 'Dr. Smith', isbn: '978-1234567890', available: 15 },
  { id: 'BK002', title: 'Physics Fundamentals', author: 'Prof. Johnson', isbn: '978-0987654321', available: 8 },
  { id: 'BK003', title: 'Chemistry Lab Manual', author: 'Dr. Brown', isbn: '978-1122334455', available: 12 },
  { id: 'BK004', title: 'Biology: The Living World', author: 'Dr. Wilson', isbn: '978-2233445566', available: 10 },
  { id: 'BK005', title: 'English Literature Classics', author: 'Prof. Davis', isbn: '978-3344556677', available: 20 },
  { id: 'BK006', title: 'History of Modern Europe', author: 'Dr. Anderson', isbn: '978-4455667788', available: 7 },
  { id: 'BK007', title: 'Geography: World Atlas', author: 'Prof. Taylor', isbn: '978-5566778899', available: 5 },
  { id: 'BK008', title: 'Computer Science Basics', author: 'Dr. Martinez', isbn: '978-6677889900', available: 18 },
  { id: 'BK009', title: 'Art History: Renaissance', author: 'Prof. Garcia', isbn: '978-7788990011', available: 9 },
  { id: 'BK010', title: 'Music Theory Fundamentals', author: 'Dr. Rodriguez', isbn: '978-8899001122', available: 14 },
  { id: 'BK011', title: 'Physical Education Guide', author: 'Prof. Lee', isbn: '978-9900112233', available: 25 },
  { id: 'BK012', title: 'Psychology: Mind and Behavior', author: 'Dr. White', isbn: '978-0011223344', available: 11 },
  { id: 'BK013', title: 'Economics: Principles', author: 'Prof. Clark', isbn: '978-1122334455', available: 13 },
  { id: 'BK014', title: 'Philosophy: Ancient Thinkers', author: 'Dr. Lewis', isbn: '978-2233445566', available: 6 },
  { id: 'BK015', title: 'Sociology: Society Today', author: 'Prof. Hall', isbn: '978-3344556677', available: 16 },
  { id: 'BK016', title: 'Environmental Science', author: 'Dr. Young', isbn: '978-4455667788', available: 12 },
  { id: 'BK017', title: 'Astronomy: Exploring Space', author: 'Prof. King', isbn: '978-5566778899', available: 8 },
  { id: 'BK018', title: 'Oceanography: Marine Life', author: 'Dr. Wright', isbn: '978-6677889900', available: 4 }
])
const classStudents = ref([
  { id: 'STU001', name: 'Anna Andersson', class: '10A', selected: false },
  { id: 'STU002', name: 'Erik Eriksson', class: '10A', selected: false },
  { id: 'STU003', name: 'Maria Nilsson', class: '10A', selected: false },
  { id: 'STU004', name: 'Johan Johansson', class: '10A', selected: false },
  { id: 'STU005', name: 'Sofia Svensson', class: '10A', selected: false }
])
const courseStudents = ref([
  { id: 'STU006', name: 'Lars Larsson', class: '9B', selected: false },
  { id: 'STU007', name: 'Eva Ekström', class: '9B', selected: false },
  { id: 'STU008', name: 'Peter Pettersson', class: '9B', selected: false },
  { id: 'STU009', name: 'Karin Karlsson', class: '9B', selected: false }
])
const selectedBook = ref(null)
const selectedStudents = ref([])
const showClassCourseModal = ref(false)

// Add search and pagination for available books
const bookSearch = ref('')
const currentBookPage = ref(1)
const booksPerPage = 5

const filteredBooks = computed(() => {
  const search = bookSearch.value.toLowerCase()
  return availableBooks.value.filter(book =>
    book.title.toLowerCase().includes(search) ||
    book.author.toLowerCase().includes(search) ||
    book.isbn.toLowerCase().includes(search)
  )
})

const paginatedBooks = computed(() => {
  const start = (currentBookPage.value - 1) * booksPerPage
  const end = start + booksPerPage
  return filteredBooks.value.slice(start, end)
})

const totalBookPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / booksPerPage)
})

function nextBookPage() {
  if (currentBookPage.value < totalBookPages.value) {
    currentBookPage.value++
  }
}

function prevBookPage() {
  if (currentBookPage.value > 1) {
    currentBookPage.value--
  }
}

function goToBookPage(page) {
  currentBookPage.value = page
}

// Reset pagination when search changes
watch(bookSearch, () => {
  currentBookPage.value = 1
})

function openClassCourseModal(entity) {
  selectedBook.value = null
  selectedStudents.value = []
  bookSearch.value = ''
  currentBookPage.value = 1
  // Reset student selections
  if (activeTab.value === 'class') {
    classStudents.value.forEach(s => s.selected = false)
  } else if (activeTab.value === 'course') {
    courseStudents.value.forEach(s => s.selected = false)
  }
  showClassCourseModal.value = true
}
function selectBook(book) {
  selectedBook.value = book
}
function toggleStudentSelection(student) {
  student.selected = !student.selected
  if (student.selected) {
    selectedStudents.value.push(student)
  } else {
    const index = selectedStudents.value.findIndex(s => s.id === student.id)
    if (index > -1) {
      selectedStudents.value.splice(index, 1)
    }
  }
}
function selectAllStudents() {
  const students = activeTab.value === 'class' ? classStudents.value : courseStudents.value
  students.forEach(s => {
    s.selected = true
    if (!selectedStudents.value.find(ss => ss.id === s.id)) {
      selectedStudents.value.push(s)
    }
  })
}
function deselectAllStudents() {
  const students = activeTab.value === 'class' ? classStudents.value : courseStudents.value
  students.forEach(s => {
    s.selected = false
  })
  selectedStudents.value = []
}
function handleClassCourseLending() {
  if (!selectedBook.value || selectedStudents.value.length === 0) {
    alert('Please select a book and at least one student')
    return
  }
  // Handle the lending logic here
  console.log('Lending book:', selectedBook.value, 'to students:', selectedStudents.value)
  showClassCourseModal.value = false
}
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
              @click="openStudentSelect"
              class="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <Plus class="w-5 h-5" />
              Lend New Book
            </button>
          </div>

          <!-- Student Select Modal -->
          <div v-if="lendingMode">
            <div class="flex items-center gap-2 mb-4">
              <button @click="cancelLendingMode" class="bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-white font-medium px-4 py-2 rounded-lg">Cancel</button>
              <h2 class="text-xl font-bold text-slate-700 dark:text-white flex items-center gap-2">
                <Search class="w-5 h-5" />
                <span v-if="activeTab === 'student'">Search Student</span>
                <span v-else-if="activeTab === 'staff'">Search Staff</span>
                <span v-else-if="activeTab === 'class'">Search Class</span>
                <span v-else-if="activeTab === 'course'">Search Course</span>
              </h2>
            </div>
            <input v-model="studentSearch" type="text" :placeholder="activeTab === 'student' ? 'Search by name, class, or ID' : activeTab === 'staff' ? 'Search by name, department, or ID' : activeTab === 'class' ? 'Search by class name or ID' : 'Search by course name, code, or ID'" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white mb-4" />
            <div class="max-h-64 overflow-y-auto space-y-2">
              <div v-for="entity in filteredSearchList" :key="entity.id" @click="selectEntity(entity)" class="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition">
                <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-slate-500 dark:text-gray-300">
                  <User class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-slate-800 dark:text-white">{{ entity.name }}</div>
                  <div v-if="activeTab === 'student'" class="text-xs text-slate-500 dark:text-gray-400">Class: {{ entity.class }} | ID: {{ entity.id }}</div>
                  <div v-else-if="activeTab === 'staff'" class="text-xs text-slate-500 dark:text-gray-400">Department: {{ entity.department }} | ID: {{ entity.id }}</div>
                  <div v-else-if="activeTab === 'class'" class="text-xs text-slate-500 dark:text-gray-400">Year: {{ entity.year }} | ID: {{ entity.id }}</div>
                  <div v-else-if="activeTab === 'course'" class="text-xs text-slate-500 dark:text-gray-400">Code: {{ entity.code }} | ID: {{ entity.id }}</div>
                </div>
              </div>
              <div v-if="filteredSearchList.length === 0" class="text-center text-slate-400 dark:text-gray-500 py-4">No results found.</div>
            </div>
          </div>
          <div v-else>
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
                      <div v-if="lending.copies && (lending.type === 'class' || lending.type === 'course')" class="text-xs text-slate-400 dark:text-gray-400">
                        {{ lending.copies }} copies
                      </div>
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
                    <p v-if="lending.copies && (lending.type === 'class' || lending.type === 'course')" class="text-xs text-slate-400 dark:text-gray-400">
                      {{ lending.copies }} copies
                    </p>
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
              @click="openStudentSelect"
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
    <div v-if="showLendingModal && selectedStudent" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
        <button @click="showLendingModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400">
          <X class="w-6 h-6" />
        </button>
        <h2 class="text-xl font-bold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen class="w-5 h-5" /> Lend Book
        </h2>
        <div class="mb-4">
          <div class="flex gap-4 items-center mb-2">
            <User class="w-6 h-6 text-blue-500" />
            <div>
              <div class="font-semibold text-slate-800 dark:text-white">{{ selectedStudent.name }}</div>
              <div v-if="activeTab === 'student'" class="text-xs text-slate-500 dark:text-gray-400">Class: {{ selectedStudent.class }} | ID: {{ selectedStudent.id }}</div>
              <div v-else-if="activeTab === 'staff'" class="text-xs text-slate-500 dark:text-gray-400">Department: {{ selectedStudent.department }} | ID: {{ selectedStudent.id }}</div>
              <div v-else-if="activeTab === 'class'" class="text-xs text-slate-500 dark:text-gray-400">Year: {{ selectedStudent.year }} | ID: {{ selectedStudent.id }}</div>
              <div v-else-if="activeTab === 'course'" class="text-xs text-slate-500 dark:text-gray-400">Code: {{ selectedStudent.code }} | ID: {{ selectedStudent.id }}</div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'student' || activeTab === 'staff'" class="mb-3">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Scan Book</label>
          <div class="flex gap-2">
            <input ref="scanInputRef" v-model="scanInput" type="text" placeholder="Scan or enter book barcode/ID" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
            <button @click="focusScanInput" class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg">Scan</button>
          </div>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Book Title</label>
          <input v-model="newLending.bookTitle" type="text" placeholder="Book Title" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 mb-2" />
          <input v-model="newLending.isbn" type="text" placeholder="ISBN" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 mb-2" />
          <input v-model="newLending.bookId" type="text" placeholder="Book ID" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Notes</label>
          <textarea v-model="newLending.notes" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"></textarea>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" @click="showLendingModal = false" class="bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-white font-medium px-4 py-2 rounded-lg">Cancel</button>
          <button type="button" @click="handleNewLending" class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 font-medium px-4 py-2 rounded-lg">Lend Book</button>
        </div>
      </div>
    </div>

    <!-- Take Back Modal -->
    <div v-if="showTakeBackModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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

    <!-- Class/Course Lending Modal -->
    <div v-if="showClassCourseModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-slate-700 dark:text-white flex items-center gap-2">
              <BookOpen class="w-6 h-6" />
              <span v-if="activeTab === 'class'">Class Book Lending</span>
              <span v-else-if="activeTab === 'course'">Course Book Lending</span>
            </h2>
            <p class="text-slate-500 dark:text-gray-400 mt-1">
              <span v-if="activeTab === 'class'">Select books and students for {{ selectedStudent?.name }}</span>
              <span v-else-if="activeTab === 'course'">Select books and students for {{ selectedStudent?.name }}</span>
            </p>
          </div>
          <button @click="showClassCourseModal = false" class="text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="flex h-[calc(90vh-140px)]">
          <!-- Left Side - Available Books -->
          <div class="w-1/2 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen class="w-5 h-5" />
              Available Books
            </h3>
            
            <!-- Search -->
            <div class="mb-4">
              <input 
                v-model="bookSearch" 
                type="text" 
                placeholder="Search books by title, author, or ISBN..." 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-600 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <!-- Books List -->
            <div class="space-y-3 mb-4">
              <div
                v-for="book in paginatedBooks"
                :key="book.id"
                @click="selectBook(book)"
                :class="[
                  'p-4 rounded-lg border-2 cursor-pointer transition-all',
                  selectedBook?.id === book.id
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-yellow-300 dark:hover:border-yellow-600'
                ]"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-slate-800 dark:text-white">{{ book.title }}</h4>
                  <span class="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                    {{ book.available }} available
                  </span>
                </div>
                <p class="text-sm text-slate-600 dark:text-gray-300 mb-1">Author: {{ book.author }}</p>
                <p class="text-xs text-slate-500 dark:text-gray-400">ISBN: {{ book.isbn }}</p>
              </div>
              
              <!-- No results message -->
              <div v-if="filteredBooks.length === 0" class="text-center text-slate-400 dark:text-gray-500 py-8">
                <BookOpen class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No books found matching your search.</p>
              </div>
            </div>
            
            <!-- Pagination -->
            <div v-if="totalBookPages > 1" class="flex justify-between items-center">
              <div class="text-sm text-slate-500 dark:text-gray-400">
                Showing {{ (currentBookPage - 1) * booksPerPage + 1 }} to {{ Math.min(currentBookPage * booksPerPage, filteredBooks.length) }} of {{ filteredBooks.length }} books
              </div>
              <div class="flex gap-1">
                <button 
                  @click="prevBookPage" 
                  :disabled="currentBookPage === 1"
                  class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                
                <div class="flex gap-1">
                  <button 
                    v-for="page in Math.min(5, totalBookPages)" 
                    :key="page"
                    @click="goToBookPage(page)"
                    :class="[
                      'px-3 py-1 text-sm border rounded-lg',
                      currentBookPage === page
                        ? 'bg-yellow-500 border-yellow-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <button 
                  @click="nextBookPage" 
                  :disabled="currentBookPage === totalBookPages"
                  class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <!-- Right Side - Students -->
          <div class="w-1/2 p-6 overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-slate-700 dark:text-white flex items-center gap-2">
                <Users class="w-5 h-5" />
                Students
                <span class="text-sm text-slate-500 dark:text-gray-400">({{ selectedStudents.length }} selected)</span>
              </h3>
              <div class="flex gap-2">
                <button @click="selectAllStudents" class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50">
                  Select All
                </button>
                <button @click="deselectAllStudents" class="text-xs bg-gray-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                  Deselect All
                </button>
              </div>
            </div>
            <div class="space-y-2">
              <div
                v-for="student in (activeTab === 'class' ? classStudents : courseStudents)"
                :key="student.id"
                @click="toggleStudentSelection(student)"
                :class="[
                  'p-3 rounded-lg border-2 cursor-pointer transition-all',
                  student.selected
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-yellow-300 dark:hover:border-yellow-600'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User class="w-4 h-4 text-slate-500 dark:text-gray-300" />
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-slate-800 dark:text-white">{{ student.name }}</div>
                    <div class="text-xs text-slate-500 dark:text-gray-400">Class: {{ student.class }} | ID: {{ student.id }}</div>
                  </div>
                  <div v-if="student.selected" class="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Check class="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div class="text-sm text-slate-500 dark:text-gray-400">
            <span v-if="selectedBook">Selected: {{ selectedBook.title }}</span>
            <span v-if="selectedStudents.length > 0"> | {{ selectedStudents.length }} students selected</span>
          </div>
          <div class="flex gap-3">
            <button @click="showClassCourseModal = false" class="bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              Cancel
            </button>
            <button 
              @click="handleClassCourseLending"
              :disabled="!selectedBook || selectedStudents.length === 0"
              class="bg-[#FECF44] hover:bg-yellow-400 text-slate-800 font-medium px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <BookOpen class="w-4 h-4" />
              Lend Books
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