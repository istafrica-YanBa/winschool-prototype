<template>
  <div class="student-course-assignment bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div class="flex items-start">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
          <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
            Student Assignment
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
            Assign students to courses with drag-and-drop functionality
          </p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          @click="exportAssignments"
          class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
        <button 
          @click="bulkAssign"
          class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
        >
          <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Bulk Assign
        </button>
      </div>
    </div>

    <!-- Stats Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ totalStudents }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Students</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ assignedStudents }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Assigned</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ pendingStudents }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</div>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-200">{{ availableCourses }}</div>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400">Available Courses</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Controls -->
    <div class="bg-white shadow-md rounded-xl p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
            Search Students
          </label>
          <div class="relative">
            <input
              v-model="filters.studentSearch"
              type="text"
              placeholder="Search by name or ID..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              style="font-family: Inter, sans-serif;"
            />
            <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
            Filter by Grade
          </label>
          <select
            v-model="filters.grade"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            style="font-family: Inter, sans-serif;"
          >
            <option value="">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
            Filter by Subject
          </label>
          <select
            v-model="filters.subject"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            style="font-family: Inter, sans-serif;"
          >
            <option value="">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">
            Assignment Status
          </label>
          <select
            v-model="filters.status"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
            style="font-family: Inter, sans-serif;"
          >
            <option value="">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="pending">Pending</option>
            <option value="conflict">Conflict</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Assignment Interface -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Students List -->
      <div class="bg-white shadow-md rounded-xl p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900" style="font-family: Inter, sans-serif;">Students</h2>
          <button
            @click="toggleSelectAll"
            class="text-sm text-teal-600 hover:text-teal-800 font-medium"
            style="font-family: Inter, sans-serif;"
          >
            {{ allSelected ? 'Deselect All' : 'Select All' }}
          </button>
        </div>

        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="student in filteredStudents"
            :key="student.id"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors cursor-pointer"
            :class="{ 'bg-teal-50 border-teal-300': selectedStudents.includes(student.id) }"
            @click="toggleStudentSelection(student.id)"
            draggable="true"
            @dragstart="onDragStart($event, student)"
          >
            <input
              type="checkbox"
              :checked="selectedStudents.includes(student.id)"
              class="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              @click.stop
              @change="toggleStudentSelection(student.id)"
            />
            <div class="ml-3 flex-1">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">{{ student.name }}</span>
                <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full" style="font-family: Inter, sans-serif;">
                  Grade {{ student.grade }}
                </span>
              </div>
              <div class="text-xs text-gray-500 mt-1" style="font-family: Inter, sans-serif;">
                ID: {{ student.studentId }} | {{ student.courses.length }} courses
              </div>
            </div>
            <div class="flex items-center space-x-1">
              <span
                v-if="student.hasConflict"
                class="w-2 h-2 bg-red-500 rounded-full"
                title="Has scheduling conflict"
              ></span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div v-if="filteredStudents.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">No students found</h3>
          <p class="mt-1 text-sm text-gray-500" style="font-family: Inter, sans-serif;">Try adjusting your filters.</p>
        </div>
      </div>

      <!-- Courses List -->
      <div class="bg-white shadow-md rounded-xl p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6" style="font-family: Inter, sans-serif;">Available Courses</h2>

        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
            @drop="onDropToCourse($event, course)"
            @dragover.prevent
            @dragenter.prevent
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">{{ course.name }}</h3>
                <p class="text-xs text-gray-500" style="font-family: Inter, sans-serif;">{{ course.code }} | {{ course.subject }}</p>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-500" style="font-family: Inter, sans-serif;">
                  {{ course.enrolledStudents }}/{{ course.capacity }}
                </span>
                <div class="w-16 bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    class="bg-teal-600 h-1 rounded-full"
                    :style="{ width: (course.enrolledStudents / course.capacity * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-600" style="font-family: Inter, sans-serif;">{{ course.teacher }}</span>
                <span class="text-xs text-gray-400" style="font-family: Inter, sans-serif;">•</span>
                <span class="text-xs text-gray-600" style="font-family: Inter, sans-serif;">{{ course.credits }} credits</span>
              </div>
              <button
                @click="showCourseDetails(course)"
                class="text-xs text-teal-600 hover:text-teal-800 font-medium"
                style="font-family: Inter, sans-serif;"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Assignment Actions & Preview -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-white shadow-md rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4" style="font-family: Inter, sans-serif;">Quick Actions</h3>
          
          <div class="space-y-3">
            <button
              @click="assignSelectedStudents"
              :disabled="selectedStudents.length === 0"
              class="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style="font-family: Inter, sans-serif;"
            >
              Assign Selected ({{ selectedStudents.length }})
            </button>
            
            <button
              @click="bulkAssignByGrade"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Bulk Assign by Grade
            </button>
            
            <button
              @click="detectConflicts"
              class="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Detect Conflicts
            </button>
            
            <button
              @click="clearAllAssignments"
              class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              style="font-family: Inter, sans-serif;"
            >
              Clear All
            </button>
          </div>
        </div>

        <!-- Recent Assignments -->
        <div class="bg-white shadow-md rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4" style="font-family: Inter, sans-serif;">Recent Assignments</h3>
          
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div
              v-for="assignment in recentAssignments"
              :key="assignment.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">
                  {{ assignment.studentName }}
                </div>
                <div class="text-xs text-gray-500" style="font-family: Inter, sans-serif;">
                  → {{ assignment.courseName }}
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span 
                  :class="getStatusBadgeClass(assignment.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  style="font-family: Inter, sans-serif;"
                >
                  {{ assignment.status }}
                </span>
                <button
                  @click="undoAssignment(assignment)"
                  class="text-gray-400 hover:text-red-600 transition-colors"
                  title="Undo"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="recentAssignments.length === 0" class="text-center py-6">
            <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="mt-2 text-sm text-gray-500" style="font-family: Inter, sans-serif;">No recent assignments</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface Student {
  id: string
  name: string
  studentId: string
  grade: number
  courses: string[]
  hasConflict: boolean
}

interface Course {
  id: string
  name: string
  code: string
  subject: string
  teacher: string
  credits: number
  capacity: number
  enrolledStudents: number
  status: 'active' | 'inactive'
}

interface Assignment {
  id: string
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  status: 'assigned' | 'pending' | 'conflict'
  timestamp: Date
}

// State
const selectedStudents = ref<string[]>([])
const draggedStudent = ref<Student | null>(null)
const recentAssignments = ref<Assignment[]>([])

const filters = ref({
  studentSearch: '',
  grade: '',
  subject: '',
  status: ''
})

// Mock Data
const students = ref<Student[]>([
  { id: '1', name: 'Alice Johnson', studentId: 'S001', grade: 11, courses: ['MATH101', 'PHYS201'], hasConflict: false },
  { id: '2', name: 'Bob Smith', studentId: 'S002', grade: 10, courses: ['CHEM101'], hasConflict: true },
  { id: '3', name: 'Carol Davis', studentId: 'S003', grade: 12, courses: ['BIO301', 'CHEM301'], hasConflict: false },
  { id: '4', name: 'David Wilson', studentId: 'S004', grade: 9, courses: [], hasConflict: false },
  { id: '5', name: 'Eva Brown', studentId: 'S005', grade: 11, courses: ['CS201'], hasConflict: false }
])

const courses = ref<Course[]>([
  { id: 'MATH101', name: 'Algebra I', code: 'MATH101', subject: 'Mathematics', teacher: 'Dr. Smith', credits: 3, capacity: 30, enrolledStudents: 25, status: 'active' },
  { id: 'PHYS201', name: 'Physics II', code: 'PHYS201', subject: 'Physics', teacher: 'Prof. Johnson', credits: 4, capacity: 25, enrolledStudents: 20, status: 'active' },
  { id: 'CHEM101', name: 'General Chemistry', code: 'CHEM101', subject: 'Chemistry', teacher: 'Dr. Williams', credits: 4, capacity: 28, enrolledStudents: 15, status: 'active' },
  { id: 'BIO301', name: 'Advanced Biology', code: 'BIO301', subject: 'Biology', teacher: 'Prof. Brown', credits: 3, capacity: 20, enrolledStudents: 18, status: 'active' },
  { id: 'CS201', name: 'Computer Science II', code: 'CS201', subject: 'Computer Science', teacher: 'Dr. Davis', credits: 3, capacity: 22, enrolledStudents: 12, status: 'active' }
])

// Computed
const filteredStudents = computed(() => {
  let filtered = students.value

  if (filters.value.studentSearch) {
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(filters.value.studentSearch.toLowerCase()) ||
      student.studentId.toLowerCase().includes(filters.value.studentSearch.toLowerCase())
    )
  }

  if (filters.value.grade) {
    filtered = filtered.filter(student => student.grade.toString() === filters.value.grade)
  }

  if (filters.value.status) {
    if (filters.value.status === 'conflict') {
      filtered = filtered.filter(student => student.hasConflict)
    }
  }

  return filtered
})

const filteredCourses = computed(() => {
  let filtered = courses.value

  if (filters.value.subject) {
    filtered = filtered.filter(course => course.subject === filters.value.subject)
  }

  return filtered
})

const totalStudents = computed(() => students.value.length)
const assignedStudents = computed(() => recentAssignments.value.filter(a => a.status === 'assigned').length)
const pendingStudents = computed(() => recentAssignments.value.filter(a => a.status === 'pending').length)
const availableCourses = computed(() => courses.value.filter(c => c.status === 'active').length)

const allSelected = computed(() => {
  return filteredStudents.value.length > 0 && selectedStudents.value.length === filteredStudents.value.length
})

// Methods
const toggleStudentSelection = (studentId: string) => {
  const index = selectedStudents.value.indexOf(studentId)
  if (index > -1) {
    selectedStudents.value.splice(index, 1)
  } else {
    selectedStudents.value.push(studentId)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedStudents.value = []
  } else {
    selectedStudents.value = filteredStudents.value.map(s => s.id)
  }
}

const onDragStart = (event: DragEvent, student: Student) => {
  draggedStudent.value = student
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', student.id)
  }
}

const onDropToCourse = (event: DragEvent, course: Course) => {
  event.preventDefault()
  if (draggedStudent.value) {
    assignStudentToCourse(draggedStudent.value, course)
    draggedStudent.value = null
  }
}

const assignStudentToCourse = (student: Student, course: Course) => {
  // Check if already assigned
  if (student.courses.includes(course.id)) {
    alert(`${student.name} is already assigned to ${course.name}`)
    return
  }

  // Check capacity
  if (course.enrolledStudents >= course.capacity) {
    alert(`${course.name} is at full capacity`)
    return
  }

  // Assign student to course
  student.courses.push(course.id)
  course.enrolledStudents++

  // Add to recent assignments
  recentAssignments.value.unshift({
    id: Date.now().toString(),
    studentId: student.id,
    studentName: student.name,
    courseId: course.id,
    courseName: course.name,
    status: 'assigned',
    timestamp: new Date()
  })

  console.log(`Assigned ${student.name} to ${course.name}`)
}

const assignSelectedStudents = () => {
  if (selectedStudents.value.length === 0) return
  
  // Show course selection modal (simplified for this example)
  const courseId = prompt('Enter course ID to assign selected students:')
  if (!courseId) return

  const course = courses.value.find(c => c.id === courseId)
  if (!course) {
    alert('Course not found')
    return
  }

  selectedStudents.value.forEach(studentId => {
    const student = students.value.find(s => s.id === studentId)
    if (student) {
      assignStudentToCourse(student, course)
    }
  })

  selectedStudents.value = []
}

const bulkAssignByGrade = () => {
  console.log('Bulk assign by grade')
  // Implementation for bulk assignment
}

const detectConflicts = () => {
  console.log('Detecting conflicts...')
  // Implementation for conflict detection
}

const clearAllAssignments = () => {
  if (confirm('Are you sure you want to clear all assignments?')) {
    students.value.forEach(student => {
      student.courses = []
    })
    courses.value.forEach(course => {
      course.enrolledStudents = 0
    })
    recentAssignments.value = []
    console.log('All assignments cleared')
  }
}

const undoAssignment = (assignment: Assignment) => {
  const student = students.value.find(s => s.id === assignment.studentId)
  const course = courses.value.find(c => c.id === assignment.courseId)
  
  if (student && course) {
    const courseIndex = student.courses.indexOf(course.id)
    if (courseIndex > -1) {
      student.courses.splice(courseIndex, 1)
      course.enrolledStudents--
    }
  }

  const assignmentIndex = recentAssignments.value.findIndex(a => a.id === assignment.id)
  if (assignmentIndex > -1) {
    recentAssignments.value.splice(assignmentIndex, 1)
  }

  console.log('Assignment undone')
}

const showCourseDetails = (course: Course) => {
  console.log('Show course details:', course)
  // Implementation for showing course details
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'assigned':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'conflict':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const bulkAssign = () => {
  console.log('Bulk assign')
  // Implementation for bulk assign
}

const exportAssignments = () => {
  console.log('Export assignments')
  // Implementation for exporting assignments
}

// Lifecycle
onMounted(() => {
  console.log('Student Course Assignment View mounted')
})
</script>

<style scoped>
.student-course-assignment {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Drag and drop styles */
[draggable="true"] {
  cursor: move;
}

[draggable="true"]:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style> 
