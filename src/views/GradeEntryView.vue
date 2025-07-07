<template>
  <div class="grade-entry bg-gray-50 min-h-screen p-6">
    <!-- Page Title Section -->
    <div class="mb-8">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-gray-900" style="font-family: Inter, sans-serif;">
            Grade Entry
          </h1>
          <p class="mt-2 text-gray-600" style="font-family: Inter, sans-serif;">
            Enter and manage student grades for courses and assessments
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <div v-if="selectedCourse" class="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span class="text-sm font-medium" style="font-family: Inter, sans-serif;">{{ selectedCourse.name }}</span>
          </div>
          <button 
            @click="saveAllGrades"
            :disabled="!hasModifiedGrades"
            class="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
            style="font-family: Inter, sans-serif;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span class="text-sm">Save All</span>
          </button>
          <button 
            @click="exportGrades"
            class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
            style="font-family: Inter, sans-serif;"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm">Export</span>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Course Selection Panel -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800" style="font-family: Inter, sans-serif;">Course Selection</h2>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">Subject</label>
              <select
                v-model="selectedSubject"
                @change="handleSubjectChange"
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                style="font-family: Inter, sans-serif;"
              >
                <option value="">Select Subject</option>
                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">Course</label>
              <select
                v-model="selectedCourseId"
                @change="handleCourseChange"
                :disabled="!selectedSubject"
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style="font-family: Inter, sans-serif;"
              >
                <option value="">Select Course</option>
                <option v-for="course in filteredCourses" :key="course.id" :value="course.id">{{ course.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" style="font-family: Inter, sans-serif;">Grade Type</label>
              <select
                v-model="gradeType"
                :disabled="!selectedCourseId"
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style="font-family: Inter, sans-serif;"
              >
                <option value="oral">Oral</option>
                <option value="written">Written</option>
                <option value="final">Final</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Statistics Card -->
        <div v-if="selectedCourse" class="bg-white rounded-xl shadow-md p-6 mt-6">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-winschool-primary rounded-xl flex items-center justify-center mr-3">
              <svg class="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800" style="font-family: Inter, sans-serif;">Statistics</h3>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-600" style="font-family: Inter, sans-serif;">Average Grade</span>
              <span class="text-lg font-bold text-gray-900" style="font-family: Inter, sans-serif;">{{ calculateAverage().toFixed(1) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-600" style="font-family: Inter, sans-serif;">Highest Grade</span>
              <span class="text-lg font-bold text-green-600" style="font-family: Inter, sans-serif;">{{ calculateHighest().toFixed(1) }}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span class="text-sm font-medium text-gray-600" style="font-family: Inter, sans-serif;">Lowest Grade</span>
              <span class="text-lg font-bold text-red-600" style="font-family: Inter, sans-serif;">{{ calculateLowest().toFixed(1) }}</span>
            </div>
            
            <div class="border-t pt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-3" style="font-family: Inter, sans-serif;">Grade Distribution</h4>
              <div class="space-y-2">
                <div v-for="(count, grade) in gradeDistribution" :key="grade" class="flex items-center justify-between">
                  <span class="text-xs text-gray-600" style="font-family: Inter, sans-serif;">Grade {{ grade }}.0</span>
                  <div class="flex items-center space-x-2 flex-1 ml-3">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${(count / totalGrades) * 100}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-600 min-w-[2rem]" style="font-family: Inter, sans-serif;">{{ count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grade Entry Table -->
      <div class="lg:col-span-3">
        <div v-if="selectedCourse" class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900" style="font-family: Inter, sans-serif;">
                Student Grades - {{ gradeType.charAt(0).toUpperCase() + gradeType.slice(1) }}
              </h2>
              <div class="relative">
                <input
                  v-model="search"
                  type="text"
                  placeholder="Search students..."
                  class="bg-white border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  style="font-family: Inter, sans-serif;"
                />
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="font-family: Inter, sans-serif;">Student</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="font-family: Inter, sans-serif;">Class</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="font-family: Inter, sans-serif;">Current Grade</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="font-family: Inter, sans-serif;">{{ gradeType.charAt(0).toUpperCase() + gradeType.slice(1) }} Grade</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style="font-family: Inter, sans-serif;">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in filteredStudents" :key="student.id" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img :src="student.avatar" :alt="student.name" class="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm mr-3" />
                      <div>
                        <div class="text-sm font-medium text-gray-900" style="font-family: Inter, sans-serif;">{{ student.name }}</div>
                        <div class="text-sm text-gray-500" style="font-family: Inter, sans-serif;">ID: {{ student.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style="font-family: Inter, sans-serif;">{{ student.class }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getCurrentGradeColorClass(getCurrentGrade(student))" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style="font-family: Inter, sans-serif;"
                    >
                      {{ getCurrentGrade(student) || 'N/A' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      :value="getGradeValue(student)"
                      @input="updateGradeValue(student, ($event.target as HTMLInputElement).value)"
                      type="number"
                      min="1.0"
                      max="6.0"
                      step="0.1"
                      placeholder="Enter grade"
                      class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-center"
                      style="font-family: Inter, sans-serif;"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getStatusColorClass(getStudentStatus(student))" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style="font-family: Inter, sans-serif;"
                    >
                      {{ getStudentStatus(student) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredStudents.length === 0" class="p-8 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2" style="font-family: Inter, sans-serif;">No students found</h3>
            <p class="text-gray-600" style="font-family: Inter, sans-serif;">Try adjusting your search terms or select a different course.</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-xl shadow-md p-12 text-center">
          <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2" style="font-family: Inter, sans-serif;">
            No Course Selected
          </h3>
          <p class="text-gray-600 mb-6" style="font-family: Inter, sans-serif;">
            Select a subject and course from the panel on the left to start entering grades.
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h4 class="text-sm font-semibold text-blue-900 mb-2" style="font-family: Inter, sans-serif;">Getting Started:</h4>
            <ol class="text-sm text-blue-700 space-y-1" style="font-family: Inter, sans-serif;">
              <li>1. Choose a subject from the dropdown</li>
              <li>2. Select a specific course</li>
              <li>3. Pick the grade type (Oral, Written, or Final)</li>
              <li>4. Enter grades for your students</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Mock data - in a real app, this would come from an API
const subjects = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Physics' },
  { id: 3, name: 'Chemistry' },
  { id: 4, name: 'English' },
  { id: 5, name: 'German' },
  { id: 6, name: 'History' },
  { id: 7, name: 'Biology' }
]

const courses = [
  { id: 1, name: 'Advanced Mathematics', subjectId: 1 },
  { id: 2, name: 'Basic Mathematics', subjectId: 1 },
  { id: 3, name: 'Physics Lab', subjectId: 2 },
  { id: 4, name: 'Theoretical Physics', subjectId: 2 },
  { id: 5, name: 'Organic Chemistry', subjectId: 3 },
  { id: 6, name: 'English Literature', subjectId: 4 },
  { id: 7, name: 'German Grammar', subjectId: 5 },
  { id: 8, name: 'World History', subjectId: 6 },
  { id: 9, name: 'Cell Biology', subjectId: 7 }
]

const students = [
  { 
    id: 1, 
    name: 'Emma Schmidt', 
    class: '12A', 
    avatar: 'https://i.pravatar.cc/150?img=1',
    subjects: [
      { 
        courseId: 1, 
        grades: { oral: 2.3, written: 1.8, final: 2.0 }, 
        status: 'enrolled' 
      }
    ]
  },
  { 
    id: 2, 
    name: 'Lucas Weber', 
    class: '12A', 
    avatar: 'https://i.pravatar.cc/150?img=2',
    subjects: [
      { 
        courseId: 1, 
        grades: { oral: 3.1, written: 2.9, final: 3.0 }, 
        status: 'enrolled' 
      }
    ]
  },
  { 
    id: 3, 
    name: 'Sophie Mueller', 
    class: '12B', 
    avatar: 'https://i.pravatar.cc/150?img=3',
    subjects: [
      { 
        courseId: 1, 
        grades: { oral: 1.5, written: 1.2, final: 1.3 }, 
        status: 'enrolled' 
      }
    ]
  },
  { 
    id: 4, 
    name: 'Max Fischer', 
    class: '11A', 
    avatar: 'https://i.pravatar.cc/150?img=4',
    subjects: [
      { 
        courseId: 1, 
        grades: { oral: 2.8, written: 3.2, final: 3.0 }, 
        status: 'enrolled' 
      }
    ]
  },
  { 
    id: 5, 
    name: 'Anna Becker', 
    class: '11B', 
    avatar: 'https://i.pravatar.cc/150?img=5',
    subjects: [
      { 
        courseId: 1, 
        grades: { oral: 1.8, written: 2.1, final: 1.9 }, 
        status: 'enrolled' 
      }
    ]
  }
]

// State
const selectedSubject = ref<number | null>(null)
const selectedCourseId = ref<number | null>(null)
const selectedCourse = ref<any>(null)
const gradeType = ref<'oral' | 'written' | 'final'>('oral')
const search = ref('')
const modifiedGrades = ref(new Set())

// Computed
const filteredCourses = computed(() => {
  if (!selectedSubject.value) return []
  return courses.filter(course => course.subjectId === selectedSubject.value)
})

const studentsInCourse = computed(() => {
  if (!selectedCourseId.value) return []
  return students.filter(student =>
    student.subjects.some(subject => subject.courseId === selectedCourseId.value)
  )
})

const filteredStudents = computed(() => {
  if (!search.value) return studentsInCourse.value
  
  return studentsInCourse.value.filter(student =>
    student.name.toLowerCase().includes(search.value.toLowerCase()) ||
    student.class.toLowerCase().includes(search.value.toLowerCase())
  )
})

const gradeDistribution = computed(() => {
  if (!selectedCourseId.value || !gradeType.value) return {}
  const distribution: { [key: number]: number } = {}
  studentsInCourse.value.forEach(student => {
    const subject = student.subjects.find(s => s.courseId === selectedCourseId.value)
    if (subject && subject.grades[gradeType.value]) {
      const grade = Math.floor(subject.grades[gradeType.value])
      if (grade > 0) {
        distribution[grade] = (distribution[grade] || 0) + 1
      }
    }
  })
  return distribution
})

const totalGrades = computed(() => {
  return Object.values(gradeDistribution.value).reduce((sum, count) => sum + count, 0)
})

const hasModifiedGrades = computed(() => {
  return modifiedGrades.value.size > 0
})

// Methods
const handleSubjectChange = () => {
  selectedCourseId.value = null
  selectedCourse.value = null
}

const handleCourseChange = () => {
  if (selectedCourseId.value) {
    selectedCourse.value = courses.find(c => c.id === selectedCourseId.value) || null
  } else {
    selectedCourse.value = null
  }
}

const getGradeValue = (student: any) => {
  const subject = student.subjects.find((s: any) => s.courseId === selectedCourseId.value)
  return subject?.grades[gradeType.value] || ''
}

const updateGradeValue = (student: any, value: string) => {
  if (student && value !== undefined) {
    student.subjects.forEach((subject: any) => {
      if (subject.courseId === selectedCourseId.value) {
        subject.grades[gradeType.value] = parseFloat(value)
      }
    })
    modifiedGrades.value.add(student.id)
  }
}

const getCurrentGrade = (student: any) => {
  const subject = student.subjects.find((s: any) => s.courseId === selectedCourseId.value)
  if (!subject) return null
  
  // Calculate average of all available grades
  const grades = Object.values(subject.grades).filter(g => g !== null && g !== undefined)
  if (grades.length === 0) return null
  
  const average = grades.reduce((sum: number, grade: any) => sum + grade, 0) / grades.length
  return average.toFixed(1)
}

const getCurrentGradeColorClass = (grade: string | null) => {
  if (!grade || grade === 'N/A') return 'bg-gray-100 text-gray-800'
  const numGrade = parseFloat(grade)
  if (numGrade <= 2.0) return 'bg-green-100 text-green-800'
  if (numGrade <= 3.0) return 'bg-blue-100 text-blue-800'
  if (numGrade <= 4.0) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const getStudentStatus = (student: any) => {
  const subject = student.subjects.find((s: any) => s.courseId === selectedCourseId.value)
  return subject?.status || 'not enrolled'
}

const getStatusColorClass = (status: string) => {
  const colors = {
    enrolled: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    dropped: 'bg-red-100 text-red-800',
    'not enrolled': 'bg-gray-100 text-gray-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const calculateAverage = () => {
  if (!studentsInCourse.value.length) return 0
  const grades = studentsInCourse.value
    .map(student => {
      const subject = student.subjects.find((s: any) => s.courseId === selectedCourseId.value)
      return subject?.grades[gradeType.value]
    })
    .filter(grade => grade !== undefined && grade !== null) as number[]
  
  if (grades.length === 0) return 0
  return grades.reduce((sum, grade) => sum + grade, 0) / grades.length
}

const calculateHighest = () => {
  if (!studentsInCourse.value.length) return 0
  const grades = studentsInCourse.value
    .map(student => {
      const subject = student.subjects.find((s: any) => s.courseId === selectedCourseId.value)
      return subject?.grades[gradeType.value]
    })
    .filter(grade => grade !== undefined && grade !== null) as number[]
  
  if (grades.length === 0) return 0
  return Math.min(...grades) // Lower number = better grade in German system
}

const calculateLowest = () => {
  if (!studentsInCourse.value.length) return 0
  const grades = studentsInCourse.value
    .map(student => {
      const subject = student.subjects.find((s: any) => s.courseId === selectedCourseId.value)
      return subject?.grades[gradeType.value]
    })
    .filter(grade => grade !== undefined && grade !== null) as number[]
  
  if (grades.length === 0) return 0
  return Math.max(...grades) // Higher number = worse grade in German system
}

const saveAllGrades = () => {
  // Implementation for saving all modified grades
  console.log('Saving modified grades for students:', Array.from(modifiedGrades.value))
  modifiedGrades.value.clear()
  
  // Show success message (in a real app, this would be a toast notification)
  alert('All grades saved successfully!')
}

const exportGrades = () => {
  // Implementation for exporting grades
  console.log('Exporting grades for course:', selectedCourse.value?.name)
  alert('Export functionality would be implemented here')
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

/* Input number arrows removal */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style> 
