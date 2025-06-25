<template>
  <div class="academic-management bg-gray-50 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <svg class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              Grade Management
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              Manage grades, assessments, and academic performance across all classes and subjects
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button 
            @click="exportGrades"
            class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-50 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button 
            @click="showAddGradeModal = true"
            class="w-full sm:w-auto bg-winschool-primary hover:from-indigo-800 hover:to-blue-700 text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Grade
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="stat in academicStats" :key="stat.title" class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center">
            <div :class="stat.iconBg" class="w-12 h-12 rounded-xl flex items-center justify-center mr-4">
              <component :is="stat.icon" class="h-6 w-6 text-slate-800" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
              <p :class="stat.changeColor" class="text-sm">{{ stat.change }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex items-center mb-6">
          <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800">Filters & Search</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search students or subjects..."
              class="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            v-model="selectedClass"
            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">All Classes</option>
            <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
          </select>

          <select
            v-model="selectedSubject"
            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">All Subjects</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
          </select>

          <select
            v-model="selectedGradeRange"
            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="">All Grades</option>
            <option value="A">A Grades</option>
            <option value="B">B Grades</option>
            <option value="C">C Grades</option>
            <option value="D">D Grades</option>
            <option value="F">F Grades</option>
          </select>
        </div>
      </div>

      <!-- Grade Management Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">
              Student Grades
            </h2>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                Showing {{ filteredGrades.length }} of {{ grades.length }} entries
              </span>
              <div class="flex items-center space-x-2">
                <label class="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  v-model="sortBy"
                  @change="handleSort"
                  class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="studentName">Student Name</option>
                  <option value="subject">Subject</option>
                  <option value="grade">Grade</option>
                  <option value="date">Date</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="grade in paginatedGrades" :key="grade.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img :src="grade.studentAvatar" :alt="grade.studentName" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm mr-3" />
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ grade.studentName }}</div>
                      <div class="text-sm text-gray-500">ID: {{ grade.studentId }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ grade.class }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ grade.subject }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ grade.assessment }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="getGradeColorClass(grade.grade)" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ grade.grade }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ grade.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button @click="editGrade(grade)" class="text-blue-600 hover:text-blue-900 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="deleteGrade(grade)" class="text-red-600 hover:text-red-900 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <p class="text-sm text-gray-700">
                Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredGrades.length) }} of {{ filteredGrades.length }} results
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Class Performance -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Class Performance</h3>
          </div>
          <div class="space-y-4">
            <div v-for="classPerf in classPerformance" :key="classPerf.class" class="p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-900">{{ classPerf.class }}</h4>
                <span :class="getPerformanceColor(classPerf.average)" class="text-sm font-semibold">{{ classPerf.average }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div :class="getPerformanceBarColor(classPerf.average)" class="h-3 rounded-full transition-all duration-300" :style="{ width: classPerf.percentage + '%' }"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-2">
                <span>{{ classPerf.students }} students</span>
                <span>{{ classPerf.percentage }}% avg</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Subject Performance -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Subject Performance</h3>
          </div>
          <div class="space-y-4">
            <div v-for="subject in subjectPerformance" :key="subject.name" class="p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center mb-2">
                <h4 class="font-medium text-gray-900">{{ subject.name }}</h4>
                <span :class="getPerformanceColor(subject.average)" class="text-sm font-semibold">{{ subject.average }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div :class="getPerformanceBarColor(subject.average)" class="h-3 rounded-full transition-all duration-300" :style="{ width: subject.percentage + '%' }"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-2">
                <span>{{ subject.assessments }} assessments</span>
                <span>{{ subject.percentage }}% avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Grade Modal -->
      <div v-if="showAddGradeModal || showEditGradeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ showEditGradeModal ? 'Edit Grade' : 'Add New Grade' }}
              </h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="saveGrade" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <input v-model="gradeForm.studentName" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select v-model="gradeForm.class" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option value="">Select Class</option>
                  <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select v-model="gradeForm.subject" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option value="">Select Subject</option>
                  <option v-for="subject in subjects" :key="subject" :value="subject">{{ subject }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Assessment</label>
                <input v-model="gradeForm.assessment" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <select v-model="gradeForm.grade" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
                  <option value="">Select Grade</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="C-">C-</option>
                  <option value="D+">D+</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  class="px-4 py-2 text-sm font-medium text-slate-800 bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  {{ showEditGradeModal ? 'Update Grade' : 'Add Grade' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BookOpen, Users, TrendingUp, Award } from 'lucide-vue-next'

// State
const searchQuery = ref('')
const selectedClass = ref('')
const selectedSubject = ref('')
const selectedGradeRange = ref('')
const sortBy = ref('studentName')
const sortOrder = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const showAddGradeModal = ref(false)
const showEditGradeModal = ref(false)
const editingGrade = ref(null)

// Form state
const gradeForm = ref({
  studentName: '',
  studentId: '',
  class: '',
  subject: '',
  assessment: '',
  grade: '',
  date: new Date().toISOString().split('T')[0]
})

// Static data
const classes = ['10A', '10B', '11A', '11B', '12A', '12B']
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'German', 'History', 'Biology', 'Art', 'Music', 'Sports']

const academicStats = [
  {
    title: 'Total Grades',
    value: '156',
    change: '+12 this week',
    changeColor: 'text-green-600',
    icon: BookOpen,
    iconBg: 'bg-blue-600'
  },
  {
    title: 'Average Grade',
    value: 'B+',
    change: '+0.3 this month',
    changeColor: 'text-green-600',
    icon: TrendingUp,
    iconBg: 'bg-green-600'
  },
  {
    title: 'Active Students',
    value: '342',
    change: '+5 this term',
    changeColor: 'text-green-600',
    icon: Users,
    iconBg: 'bg-purple-600'
  },
  {
    title: 'Top Performers',
    value: '28',
    change: '+3 this month',
    changeColor: 'text-green-600',
    icon: Award,
    iconBg: 'bg-yellow-600'
  }
]

const grades = ref([
  { id: 1, studentName: 'Emma Schmidt', studentId: 'ST001', studentAvatar: 'https://i.pravatar.cc/150?img=1', class: '12A', subject: 'Mathematics', assessment: 'Midterm Exam', grade: 'A-', date: '2024-03-15' },
  { id: 2, studentName: 'Lucas Weber', studentId: 'ST002', studentAvatar: 'https://i.pravatar.cc/150?img=2', class: '12A', subject: 'Physics', assessment: 'Lab Report', grade: 'B+', date: '2024-03-14' },
  { id: 3, studentName: 'Sophie Mueller', studentId: 'ST003', studentAvatar: 'https://i.pravatar.cc/150?img=3', class: '11B', subject: 'Chemistry', assessment: 'Quiz', grade: 'A', date: '2024-03-13' },
  { id: 4, studentName: 'Max Fischer', studentId: 'ST004', studentAvatar: 'https://i.pravatar.cc/150?img=4', class: '11A', subject: 'English', assessment: 'Essay', grade: 'B', date: '2024-03-12' },
  { id: 5, studentName: 'Anna Becker', studentId: 'ST005', studentAvatar: 'https://i.pravatar.cc/150?img=5', class: '10A', subject: 'German', assessment: 'Oral Presentation', grade: 'A+', date: '2024-03-11' },
  { id: 6, studentName: 'Tom Wagner', studentId: 'ST006', studentAvatar: 'https://i.pravatar.cc/150?img=6', class: '10B', subject: 'History', assessment: 'Research Paper', grade: 'B-', date: '2024-03-10' },
  { id: 7, studentName: 'Lisa Hoffmann', studentId: 'ST007', studentAvatar: 'https://i.pravatar.cc/150?img=7', class: '12B', subject: 'Biology', assessment: 'Final Exam', grade: 'A', date: '2024-03-09' },
  { id: 8, studentName: 'David Richter', studentId: 'ST008', studentAvatar: 'https://i.pravatar.cc/150?img=8', class: '11A', subject: 'Art', assessment: 'Portfolio', grade: 'B+', date: '2024-03-08' },
  { id: 9, studentName: 'Sarah Klein', studentId: 'ST009', studentAvatar: 'https://i.pravatar.cc/150?img=9', class: '10A', subject: 'Music', assessment: 'Performance', grade: 'A-', date: '2024-03-07' },
  { id: 10, studentName: 'Jonas Schulz', studentId: 'ST010', studentAvatar: 'https://i.pravatar.cc/150?img=10', class: '12A', subject: 'Sports', assessment: 'Practical Test', grade: 'B', date: '2024-03-06' },
  { id: 11, studentName: 'Marie Braun', studentId: 'ST011', studentAvatar: 'https://i.pravatar.cc/150?img=11', class: '11B', subject: 'Mathematics', assessment: 'Test', grade: 'C+', date: '2024-03-05' },
  { id: 12, studentName: 'Paul Werner', studentId: 'ST012', studentAvatar: 'https://i.pravatar.cc/150?img=12', class: '10B', subject: 'Physics', assessment: 'Homework', grade: 'B-', date: '2024-03-04' },
  { id: 13, studentName: 'Julia Zimmermann', studentId: 'ST013', studentAvatar: 'https://i.pravatar.cc/150?img=13', class: '12B', subject: 'Chemistry', assessment: 'Lab Report', grade: 'A', date: '2024-03-03' },
  { id: 14, studentName: 'Martin Krause', studentId: 'ST014', studentAvatar: 'https://i.pravatar.cc/150?img=14', class: '11A', subject: 'English', assessment: 'Vocabulary Test', grade: 'B+', date: '2024-03-02' },
  { id: 15, studentName: 'Nina Lange', studentId: 'ST015', studentAvatar: 'https://i.pravatar.cc/150?img=15', class: '10A', subject: 'German', assessment: 'Grammar Test', grade: 'A-', date: '2024-03-01' }
])

const classPerformance = [
  { class: '12A', average: 'A-', percentage: 88, students: 28 },
  { class: '12B', average: 'B+', percentage: 85, students: 26 },
  { class: '11A', average: 'B+', percentage: 82, students: 25 },
  { class: '11B', average: 'B', percentage: 79, students: 24 },
  { class: '10A', average: 'A', percentage: 91, students: 22 },
  { class: '10B', average: 'B-', percentage: 76, students: 23 }
]

const subjectPerformance = [
  { name: 'Mathematics', average: 'B+', percentage: 85, assessments: 45 },
  { name: 'Physics', average: 'A-', percentage: 88, assessments: 32 },
  { name: 'Chemistry', average: 'A', percentage: 91, assessments: 28 },
  { name: 'English', average: 'B', percentage: 78, assessments: 41 },
  { name: 'German', average: 'A-', percentage: 87, assessments: 38 },
  { name: 'History', average: 'B+', percentage: 83, assessments: 25 }
]

// Computed
const filteredGrades = computed(() => {
  let filtered = [...grades.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(grade =>
      grade.studentName.toLowerCase().includes(query) ||
      grade.subject.toLowerCase().includes(query) ||
      grade.assessment.toLowerCase().includes(query)
    )
  }

  if (selectedClass.value) {
    filtered = filtered.filter(grade => grade.class === selectedClass.value)
  }

  if (selectedSubject.value) {
    filtered = filtered.filter(grade => grade.subject === selectedSubject.value)
  }

  if (selectedGradeRange.value) {
    filtered = filtered.filter(grade => grade.grade.startsWith(selectedGradeRange.value))
  }

  return filtered.sort((a, b) => {
    const aValue = a[sortBy.value]
    const bValue = b[sortBy.value]
    if (sortOrder.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
})

const totalPages = computed(() => Math.ceil(filteredGrades.value.length / itemsPerPage.value))

const paginatedGrades = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredGrades.value.slice(start, end)
})

// Methods
const getGradeColorClass = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800'
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800'
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800'
  if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

const getPerformanceColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600'
  if (grade.startsWith('B')) return 'text-blue-600'
  if (grade.startsWith('C')) return 'text-yellow-600'
  return 'text-red-600'
}

const getPerformanceBarColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-500'
  if (grade.startsWith('B')) return 'bg-blue-500'
  if (grade.startsWith('C')) return 'bg-yellow-500'
  return 'bg-red-500'
}

const handleSort = () => {
  // Toggle sort order if same field
  if (sortBy.value === sortBy.value) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
}

const editGrade = (grade) => {
  editingGrade.value = grade
  gradeForm.value = { ...grade }
  showEditGradeModal.value = true
}

const deleteGrade = (grade) => {
  if (confirm('Are you sure you want to delete this grade?')) {
    const index = grades.value.findIndex(g => g.id === grade.id)
    if (index !== -1) {
      grades.value.splice(index, 1)
    }
  }
}

const saveGrade = () => {
  if (showEditGradeModal.value) {
    // Update existing grade
    const index = grades.value.findIndex(g => g.id === editingGrade.value.id)
    if (index !== -1) {
      grades.value[index] = { ...gradeForm.value, id: editingGrade.value.id }
    }
  } else {
    // Add new grade
    const newGrade = {
      ...gradeForm.value,
      id: Date.now(),
      studentAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`
    }
    grades.value.unshift(newGrade)
  }
  closeModal()
}

const closeModal = () => {
  showAddGradeModal.value = false
  showEditGradeModal.value = false
  editingGrade.value = null
  gradeForm.value = {
    studentName: '',
    studentId: '',
    class: '',
    subject: '',
    assessment: '',
    grade: '',
    date: new Date().toISOString().split('T')[0]
  }
}

const exportGrades = () => {
  console.log('Exporting grades...')
  // Implementation for exporting grades to CSV/Excel
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
