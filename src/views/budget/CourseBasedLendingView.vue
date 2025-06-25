<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <Target class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            {{ language === 'de' ? 'Kursbezogene Buchausleihe' : 'Course-Based Book Lending' }}
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            {{ language === 'de' ? 'Automatische Buchlisten für eingeschriebene Kurse generieren' : 'Auto-generate book lists for enrolled courses' }}
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button @click="showFilters = !showFilters" class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Filter class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Filter' : 'Filters' }}
        </button>
        <button @click="showCreateCourseList = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
          <Plus class="h-4 w-4 mr-2" />
          {{ language === 'de' ? 'Kursliste erstellen' : 'Create Course List' }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
      <div v-for="stat in courseStats" :key="stat.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3 sm:p-6">
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
            {{ language === 'de' ? 'Semester' : 'Semester' }}
          </label>
          <select v-model="filters.semester" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Semester' : 'All Semesters' }}</option>
            <option value="Spring 2024">Spring 2024</option>
            <option value="Fall 2024">Fall 2024</option>
            <option value="Summer 2024">Summer 2024</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Fachbereich' : 'Department' }}
          </label>
          <select v-model="filters.department" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Fachbereiche' : 'All Departments' }}</option>
            <option value="Mathematics">{{ language === 'de' ? 'Mathematik' : 'Mathematics' }}</option>
            <option value="Science">{{ language === 'de' ? 'Naturwissenschaften' : 'Science' }}</option>
            <option value="Literature">{{ language === 'de' ? 'Literatur' : 'Literature' }}</option>
            <option value="History">{{ language === 'de' ? 'Geschichte' : 'History' }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ language === 'de' ? 'Status' : 'Status' }}
          </label>
          <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            <option value="">{{ language === 'de' ? 'Alle Status' : 'All Status' }}</option>
            <option value="Active">{{ language === 'de' ? 'Aktiv' : 'Active' }}</option>
            <option value="Pending">{{ language === 'de' ? 'Ausstehend' : 'Pending' }}</option>
            <option value="Completed">{{ language === 'de' ? 'Abgeschlossen' : 'Completed' }}</option>
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
          :placeholder="language === 'de' ? 'Nach Kursen oder Büchern suchen...' : 'Search courses or books...'"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Course Assignments Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-6">
          {{ language === 'de' ? 'Kurszuweisungen' : 'Course Assignments' }}
        </h2>
        
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-slate-600">
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Kurs' : 'Course' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Lehrer' : 'Instructor' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Eingeschrieben' : 'Enrolled' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Zugewiesene Bücher' : 'Assigned Books' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Status' : 'Status' }}</th>
                <th class="text-left py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ language === 'de' ? 'Aktionen' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="assignment in filteredAssignments" :key="assignment.id" class="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ assignment.courseName }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ assignment.courseCode }} - {{ assignment.semester }}</div>
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-800 dark:text-slate-200">{{ assignment.instructor }}</div>
                  <div class="text-sm text-slate-500 dark:text-slate-400">{{ assignment.department }}</div>
                </td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ assignment.enrolledStudents }}</td>
                <td class="py-3 px-4 text-slate-700 dark:text-slate-300">{{ assignment.assignedBooks }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(assignment.status)">
                    {{ language === 'de' ? getStatusTranslation(assignment.status) : assignment.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewBookList(assignment)" class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" :title="language === 'de' ? 'Buchliste anzeigen' : 'View Book List'">
                      <BookOpen class="h-4 w-4" />
                    </button>
                    <button @click="assignBooks(assignment)" class="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" :title="language === 'de' ? 'Bücher zuweisen' : 'Assign Books'">
                      <Plus class="h-4 w-4" />
                    </button>
                    <button @click="generateLendingList(assignment)" class="p-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300" :title="language === 'de' ? 'Ausleihliste generieren' : 'Generate Lending List'">
                      <FileText class="h-4 w-4" />
                    </button>
                    <button @click="viewDetails(assignment)" class="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300" :title="language === 'de' ? 'Details anzeigen' : 'View Details'">
                      <Eye class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4">
          <div v-for="assignment in filteredAssignments" :key="assignment.id" class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-medium text-slate-800 dark:text-slate-200">{{ assignment.courseName }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ assignment.courseCode }} - {{ assignment.semester }}</p>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusColor(assignment.status)">
                {{ language === 'de' ? getStatusTranslation(assignment.status) : assignment.status }}
              </span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Lehrer:' : 'Instructor:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ assignment.instructor }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Eingeschrieben:' : 'Enrolled:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ assignment.enrolledStudents }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Bücher:' : 'Books:' }}</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ assignment.assignedBooks }}</span>
              </div>
              <div class="flex justify-end space-x-2 mt-3">
                <button @click="viewBookList(assignment)" class="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800 rounded-lg">
                  <BookOpen class="h-4 w-4" />
                </button>
                <button @click="assignBooks(assignment)" class="p-2 bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800 rounded-lg">
                  <Plus class="h-4 w-4" />
                </button>
                <button @click="generateLendingList(assignment)" class="p-2 bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-400 dark:hover:bg-purple-800 rounded-lg">
                  <FileText class="h-4 w-4" />
                </button>
                <button @click="viewDetails(assignment)" class="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg">
                  <Eye class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Books Modal -->
    <div v-if="showAssignBooks || selectedAssignment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ selectedAssignment ? 
                (language === 'de' ? `Bücher für ${selectedAssignment.courseName} zuweisen` : `Assign Books for ${selectedAssignment.courseName}`) :
                (language === 'de' ? 'Bücher zuweisen' : 'Assign Books') }}
            </h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="submitBookAssignment" class="space-y-4">
            <div v-if="!selectedAssignment">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Kurs auswählen' : 'Select Course' }}
              </label>
              <select v-model="currentAssignment.courseId" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="">{{ language === 'de' ? 'Kurs auswählen...' : 'Select a course...' }}</option>
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }} ({{ course.code }})
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Verfügbare Bücher' : 'Available Books' }}
              </label>
              <div class="max-h-60 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-lg p-2">
                <div v-for="book in availableBooks" :key="book.id" class="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded">
                  <input 
                    type="checkbox" 
                    :id="`book-${book.id}`"
                    v-model="currentAssignment.selectedBooks"
                    :value="book.id"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label :for="`book-${book.id}`" class="flex-1 text-sm text-slate-700 dark:text-slate-300">
                    <div class="font-medium">{{ book.title }}</div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">{{ book.isbn }} - {{ book.author }}</div>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {{ language === 'de' ? 'Notizen' : 'Notes' }}
              </label>
              <textarea
                v-model="currentAssignment.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                :placeholder="language === 'de' ? 'Zusätzliche Anweisungen...' : 'Additional instructions...'"
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-medium rounded-lg"
              >
                {{ language === 'de' ? 'Zuweisen' : 'Assign' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Book List Modal -->
    <div v-if="showBookList" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? `Buchliste für ${viewingAssignment?.courseName}` : `Book List for ${viewingAssignment?.courseName}` }}
            </h3>
            <button @click="closeBookListModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="book in viewingAssignment?.books || []" :key="book.id" class="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ book.title }}</h4>
                  <p class="text-sm text-slate-500 dark:text-slate-400">{{ book.author }}</p>
                  <p class="text-xs text-slate-400 dark:text-slate-500">ISBN: {{ book.isbn }}</p>
                </div>
                <div class="text-right">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="book.available ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'">
                    {{ book.available ? (language === 'de' ? 'Verfügbar' : 'Available') : (language === 'de' ? 'Nicht verfügbar' : 'Unavailable') }}
                  </span>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ book.copies }} {{ language === 'de' ? 'Exemplare' : 'copies' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import {
  GraduationCap,
  ChevronRight,
  Filter,
  Plus,
  Search,
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  FileText,
  Eye,
  X,
  Target
} from 'lucide-vue-next'

const languageStore = useLanguageStore()
const language = computed(() => languageStore.language)

// Reactive data
const showFilters = ref(false)
const showAssignBooks = ref(false)
const showBookList = ref(false)
const selectedAssignment = ref(null)
const viewingAssignment = ref(null)
const searchQuery = ref('')

const filters = ref({
  semester: '',
  department: '',
  status: ''
})

const currentAssignment = ref({
  courseId: '',
  selectedBooks: [],
  notes: ''
})

// Mock data
const courseAssignments = ref([
  {
    id: 1,
    courseId: 'CS101',
    courseName: 'Introduction to Computer Science',
    courseCode: 'CS101',
    instructor: 'Dr. Smith',
    department: 'Computer Science',
    semester: 'Spring 2024',
    enrolledStudents: 25,
    assignedBooks: 3,
    status: 'Active',
    books: [
      { id: 'B001', title: 'Programming Fundamentals', author: 'John Doe', isbn: '978-0123456789', available: true, copies: 30 },
      { id: 'B002', title: 'Data Structures', author: 'Jane Smith', isbn: '978-0987654321', available: true, copies: 25 },
      { id: 'B003', title: 'Algorithms', author: 'Bob Wilson', isbn: '978-0456789123', available: false, copies: 20 }
    ]
  },
  {
    id: 2,
    courseId: 'MATH201',
    courseName: 'Advanced Calculus',
    courseCode: 'MATH201',
    instructor: 'Prof. Johnson',
    department: 'Mathematics',
    semester: 'Spring 2024',
    enrolledStudents: 18,
    assignedBooks: 2,
    status: 'Active',
    books: [
      { id: 'B004', title: 'Calculus Vol. 1', author: 'Maria Garcia', isbn: '978-0789123456', available: true, copies: 22 },
      { id: 'B005', title: 'Mathematical Analysis', author: 'Tom Brown', isbn: '978-0321654987', available: true, copies: 20 }
    ]
  },
  {
    id: 3,
    courseId: 'ENG101',
    courseName: 'English Literature',
    courseCode: 'ENG101',
    instructor: 'Dr. Williams',
    department: 'Literature',
    semester: 'Spring 2024',
    enrolledStudents: 30,
    assignedBooks: 4,
    status: 'Pending',
    books: []
  },
  {
    id: 4,
    courseId: 'HIST205',
    courseName: 'World History',
    courseCode: 'HIST205',
    instructor: 'Prof. Davis',
    department: 'History',
    semester: 'Fall 2024',
    enrolledStudents: 22,
    assignedBooks: 0,
    status: 'Pending',
    books: []
  }
])

const courses = ref([
  { id: 'BIO101', name: 'Introduction to Biology', code: 'BIO101' },
  { id: 'CHEM101', name: 'General Chemistry', code: 'CHEM101' },
  { id: 'PHYS101', name: 'Physics Fundamentals', code: 'PHYS101' }
])

const availableBooks = ref([
  { id: 'B006', title: 'Biology Textbook', author: 'Sarah Lee', isbn: '978-0111222333' },
  { id: 'B007', title: 'Chemistry Handbook', author: 'Mike Chen', isbn: '978-0222333444' },
  { id: 'B008', title: 'Physics Principles', author: 'Lisa Wang', isbn: '978-0333444555' },
  { id: 'B009', title: 'Scientific Method', author: 'Alex Turner', isbn: '978-0444555666' }
])

// Computed properties
const courseStats = computed(() => [
  {
    title: language.value === 'de' ? 'Aktive Kurse' : 'Active Courses',
    value: courseAssignments.value.filter(c => c.status === 'Active').length.toString(),
    change: language.value === 'de' ? '+2 dieses Semester' : '+2 this semester',
    changeColor: 'text-green-600 dark:text-green-400',
    icon: GraduationCap,
    iconBg: 'bg-blue-500'
  },
  {
    title: language.value === 'de' ? 'Gesamte Studenten' : 'Total Students',
    value: courseAssignments.value.reduce((sum, c) => sum + c.enrolledStudents, 0).toString(),
    change: language.value === 'de' ? 'Über alle Kurse' : 'Across all courses',
    changeColor: 'text-blue-600 dark:text-blue-400',
    icon: Users,
    iconBg: 'bg-green-500'
  },
  {
    title: language.value === 'de' ? 'Zugewiesene Bücher' : 'Assigned Books',
    value: courseAssignments.value.reduce((sum, c) => sum + c.assignedBooks, 0).toString(),
    change: language.value === 'de' ? 'Insgesamt' : 'Total',
    changeColor: 'text-purple-600 dark:text-purple-400',
    icon: BookOpen,
    iconBg: 'bg-purple-500'
  },
  {
    title: language.value === 'de' ? 'Ausstehende Zuweisungen' : 'Pending Assignments',
    value: courseAssignments.value.filter(c => c.status === 'Pending').length.toString(),
    change: language.value === 'de' ? 'Benötigen Aufmerksamkeit' : 'Need attention',
    changeColor: 'text-yellow-600 dark:text-yellow-400',
    icon: Calendar,
    iconBg: 'bg-yellow-500'
  }
])

const filteredAssignments = computed(() => {
  let assignments = courseAssignments.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    assignments = assignments.filter(
      a => a.courseName.toLowerCase().includes(query) ||
           a.courseCode.toLowerCase().includes(query) ||
           a.instructor.toLowerCase().includes(query)
    )
  }

  // Apply semester filter
  if (filters.value.semester) {
    assignments = assignments.filter(a => a.semester === filters.value.semester)
  }

  // Apply department filter
  if (filters.value.department) {
    assignments = assignments.filter(a => a.department === filters.value.department)
  }

  // Apply status filter
  if (filters.value.status) {
    assignments = assignments.filter(a => a.status === filters.value.status)
  }

  return assignments
})

// Methods
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'Completed':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getStatusTranslation = (status: string) => {
  const translations: { [key: string]: string } = {
    'Active': 'Aktiv',
    'Pending': 'Ausstehend',
    'Completed': 'Abgeschlossen'
  }
  return translations[status] || status
}

const viewBookList = (assignment: any) => {
  viewingAssignment.value = assignment
  showBookList.value = true
}

const assignBooks = (assignment: any) => {
  selectedAssignment.value = assignment
  currentAssignment.value.courseId = assignment.courseId
  showAssignBooks.value = true
}

const generateLendingList = (assignment: any) => {
  // In a real app, this would generate a lending list for all enrolled students
  console.log('Generate lending list for:', assignment)
  // Could download a CSV or PDF with all students and their assigned books
}

const viewDetails = (assignment: any) => {
  // In a real app, this would show detailed assignment information
  console.log('View assignment details:', assignment)
}

const closeModal = () => {
  showAssignBooks.value = false
  selectedAssignment.value = null
  currentAssignment.value = {
    courseId: '',
    selectedBooks: [],
    notes: ''
  }
}

const closeBookListModal = () => {
  showBookList.value = false
  viewingAssignment.value = null
}

const submitBookAssignment = () => {
  const targetCourse = selectedAssignment.value || courses.value.find(c => c.id === currentAssignment.value.courseId)
  
  if (targetCourse && currentAssignment.value.selectedBooks.length > 0) {
    const selectedBooksData = availableBooks.value.filter(b => 
      currentAssignment.value.selectedBooks.includes(b.id)
    ).map(book => ({
      ...book,
      available: true,
      copies: Math.floor(Math.random() * 30) + 10 // Random number of copies
    }))
    
    if (selectedAssignment.value) {
      // Update existing assignment
      selectedAssignment.value.books.push(...selectedBooksData)
      selectedAssignment.value.assignedBooks = selectedAssignment.value.books.length
    } else {
      // Create new assignment
      const newAssignment = {
        id: Date.now(),
        courseId: targetCourse.id,
        courseName: targetCourse.name,
        courseCode: targetCourse.code,
        instructor: 'TBD',
        department: 'General',
        semester: 'Spring 2024',
        enrolledStudents: Math.floor(Math.random() * 30) + 10,
        assignedBooks: selectedBooksData.length,
        status: 'Active',
        books: selectedBooksData
      }
      
      courseAssignments.value.unshift(newAssignment)
    }
    
    closeModal()
  }
}
</script> 