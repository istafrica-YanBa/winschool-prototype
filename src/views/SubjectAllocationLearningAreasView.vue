<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary hover:bg-winschool-primary-dark rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <BookOpenCheck class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Fachzuteilung mit Lernfeldern' : 'Subject Allocation with Learning Areas' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Fachzuteilungen und kennzeichnen Sie Lernfelder mit Sternen' : 'Manage subject allocations and mark learning areas with asterisks' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showBulkAllocationModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <UserPlus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Massenzuteilung' : 'Bulk Allocation' }}
          </button>
        </div>
      </div>

      <!-- Allocation Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Schuljahr' : 'Academic Year' }}
            </label>
            <select v-model="selectedAcademicYear" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Abteilung' : 'Department' }}
            </label>
            <select v-model="selectedDepartment" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Alle Abteilungen' : 'All Departments' }}</option>
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
            </label>
            <select v-model="selectedTeacher" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Alle Lehrer' : 'All Teachers' }}</option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Fachtyp' : 'Subject Type' }}
            </label>
            <select v-model="subjectTypeFilter" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Alle Typen' : 'All Types' }}</option>
              <option value="core">{{ language === 'de' ? 'Kernfächer' : 'Core Subjects' }}</option>
              <option value="learning-area">{{ language === 'de' ? 'Lernfelder' : 'Learning Areas' }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div class="flex items-start">
          <Info class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 class="font-medium text-blue-900 dark:text-blue-100 mb-2">
              {{ language === 'de' ? 'Kennzeichnung der Fächer' : 'Subject Marking System' }}
            </h3>
            <div class="space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <div class="flex items-center">
                <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span>{{ language === 'de' ? 'Kernfächer: ohne Kennzeichnung' : 'Core subjects: no marking' }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>{{ language === 'de' ? 'Lernfelder: mit Stern (*) gekennzeichnet' : 'Learning areas: marked with asterisk (*)' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Allocation Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Available Subjects -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Verfügbare Fächer' : 'Available Subjects' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ filteredSubjects.length }} {{ language === 'de' ? 'Fächer verfügbar' : 'subjects available' }}
            </p>
          </div>

          <div class="p-6">
            <div class="space-y-3">
              <div v-for="subject in filteredSubjects" :key="subject.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div :class="subject.isLearningArea ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'" class="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                      <component :is="subject.isLearningArea ? Target : BookOpen" :class="subject.isLearningArea ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'" class="h-5 w-5" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">
                        {{ subject.name }}{{ subject.isLearningArea ? ' *' : '' }}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ subject.code }} • {{ subject.weeklyHours }}h/{{ language === 'de' ? 'Woche' : 'week' }}
                        <span v-if="subject.isLearningArea" class="text-green-600 dark:text-green-400 ml-2">
                          ({{ language === 'de' ? 'Lernfeld' : 'Learning Area' }})
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {{ getAllocatedTeacherCount(subject.id) }}/{{ getRequiredTeacherCount(subject.id) }}
                    </span>
                    <button @click="showAllocationModal(subject)" class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                      {{ language === 'de' ? 'Zuteilen' : 'Allocate' }}
                    </button>
                  </div>
                </div>
                
                <!-- Current Allocations -->
                <div v-if="getSubjectAllocations(subject.id).length > 0" class="mt-3 pl-11">
                  <div class="space-y-1">
                    <div v-for="allocation in getSubjectAllocations(subject.id)" :key="allocation.id" class="flex items-center justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">
                        {{ getTeacherName(allocation.teacherId) }} - {{ getClassName(allocation.classId) }}
                      </span>
                      <button @click="removeAllocation(allocation.id)" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                        <X class="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Teacher Workload -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Lehrerarbeitsbelastung' : 'Teacher Workload' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ language === 'de' ? 'Übersicht der zugeteilten Stunden' : 'Overview of allocated hours' }}
            </p>
          </div>

          <div class="p-6">
            <div class="space-y-4">
              <div v-for="teacher in teachers" :key="teacher.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3">
                      <User class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">{{ teacher.name }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ teacher.department }}</p>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ getTeacherAllocatedHours(teacher.id) }}/{{ teacher.maxHours }}h
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ language === 'de' ? 'Auslastung:' : 'Load:' }} {{ getTeacherWorkloadPercentage(teacher.id) }}%
                    </div>
                  </div>
                </div>
                
                <!-- Workload Bar -->
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                  <div 
                    :class="getWorkloadBarColor(getTeacherWorkloadPercentage(teacher.id))"
                    class="h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min(getTeacherWorkloadPercentage(teacher.id), 100)}%` }"
                  ></div>
                </div>
                
                <!-- Teacher's Subjects -->
                <div class="space-y-1">
                  <div v-for="allocation in getTeacherAllocations(teacher.id)" :key="allocation.id" class="flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">
                      {{ getSubjectDisplayName(allocation.subjectId) }} - {{ getClassName(allocation.classId) }}
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">
                      {{ getSubjectHours(allocation.subjectId) }}h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Allocation Modal -->
      <div v-if="showAllocationModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Fach zuteilen:' : 'Allocate Subject:' }} {{ selectedSubject?.name }}{{ selectedSubject?.isLearningArea ? ' *' : '' }}
            </h3>
            <button @click="showAllocationModalVisible = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="createAllocation" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Lehrer' : 'Teacher' }} <span class="text-red-500">*</span>
                </label>
                <select v-model="allocationForm.teacherId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Lehrer auswählen...' : 'Select teacher...' }}</option>
                  <option v-for="teacher in availableTeachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }} ({{ getTeacherWorkloadPercentage(teacher.id) }}% {{ language === 'de' ? 'ausgelastet' : 'loaded' }})
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Klasse' : 'Class' }} <span class="text-red-500">*</span>
                </label>
                <select v-model="allocationForm.classId" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Klasse auswählen...' : 'Select class...' }}</option>
                  <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Semester' : 'Semester' }}
                </label>
                <select v-model="allocationForm.semester" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Ganzjährig' : 'Full Year' }}</option>
                  <option value="1">{{ language === 'de' ? '1. Semester' : '1st Semester' }}</option>
                  <option value="2">{{ language === 'de' ? '2. Semester' : '2nd Semester' }}</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Wochenstunden' : 'Weekly Hours' }}
                </label>
                <input 
                  v-model.number="allocationForm.weeklyHours" 
                  type="number" 
                  min="1" 
                  max="10" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  :placeholder="selectedSubject?.weeklyHours.toString()"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Notizen' : 'Notes' }}
              </label>
              <textarea v-model="allocationForm.notes" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button type="button" @click="showAllocationModalVisible = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 rounded-lg">
                {{ language === 'de' ? 'Zuteilen' : 'Allocate' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bulk Allocation Modal -->
      <div v-if="showBulkAllocationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Massenzuteilung' : 'Bulk Allocation' }}
            </h3>
            <button @click="showBulkAllocationModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="p-6">
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {{ language === 'de' ? 'Mehrere Fächer gleichzeitig zuteilen' : 'Allocate multiple subjects at once' }}
            </p>
            
            <!-- Bulk form would go here -->
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
              {{ language === 'de' ? 'Massenzuteilung - Implementierung folgt' : 'Bulk allocation - Implementation pending' }}
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showBulkAllocationModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg">
                {{ language === 'de' ? 'Schließen' : 'Close' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  BookOpenCheck, UserPlus, Info, Target, BookOpen, User, X
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const selectedAcademicYear = ref('2023-2024')
const selectedDepartment = ref('')
const selectedTeacher = ref('')
const subjectTypeFilter = ref('')
const showAllocationModalVisible = ref(false)
const showBulkAllocationModal = ref(false)
const selectedSubject = ref<any>(null)

// Form data
const allocationForm = ref({
  teacherId: '',
  classId: '',
  semester: '',
  weeklyHours: null,
  notes: ''
})

// Mock data
const academicYears = ref(['2023-2024', '2024-2025'])

const departments = ref([
  'Mathematics',
  'Science',
  'Languages', 
  'Social Studies',
  'Arts'
])

const teachers = ref([
  { id: '1', name: 'Dr. Sarah Miller', department: 'Mathematics', maxHours: 24 },
  { id: '2', name: 'Prof. John Wilson', department: 'Science', maxHours: 22 },
  { id: '3', name: 'Ms. Emily Chen', department: 'Languages', maxHours: 26 },
  { id: '4', name: 'Mr. David Brown', department: 'Mathematics', maxHours: 20 }
])

const classes = ref([
  { id: '1', name: 'Grade 10A' },
  { id: '2', name: 'Grade 10B' },
  { id: '3', name: 'Grade 11A' },
  { id: '4', name: 'Grade 11B' }
])

const subjects = ref([
  { id: '1', name: 'Mathematics', code: 'MATH', weeklyHours: 6, isLearningArea: false, requiredTeachers: 2 },
  { id: '2', name: 'Algebra', code: 'MA-ALG-01', weeklyHours: 3, isLearningArea: true, requiredTeachers: 1 },
  { id: '3', name: 'Geometry', code: 'MA-GEO-01', weeklyHours: 2, isLearningArea: true, requiredTeachers: 1 },
  { id: '4', name: 'Science', code: 'SCI', weeklyHours: 5, isLearningArea: false, requiredTeachers: 2 },
  { id: '5', name: 'Physics', code: 'SC-PHY-01', weeklyHours: 3, isLearningArea: true, requiredTeachers: 1 },
  { id: '6', name: 'Chemistry', code: 'SC-CHE-01', weeklyHours: 2, isLearningArea: true, requiredTeachers: 1 }
])

const allocations = ref([
  { id: '1', subjectId: '1', teacherId: '1', classId: '1', weeklyHours: 6, semester: '' },
  { id: '2', subjectId: '2', teacherId: '1', classId: '1', weeklyHours: 3, semester: '' },
  { id: '3', subjectId: '4', teacherId: '2', classId: '1', weeklyHours: 5, semester: '' },
  { id: '4', subjectId: '5', teacherId: '2', classId: '2', weeklyHours: 3, semester: '' }
])

// Computed
const filteredSubjects = computed(() => {
  let filtered = subjects.value

  if (subjectTypeFilter.value === 'core') {
    filtered = filtered.filter(s => !s.isLearningArea)
  } else if (subjectTypeFilter.value === 'learning-area') {
    filtered = filtered.filter(s => s.isLearningArea)
  }

  return filtered
})

const availableTeachers = computed(() => {
  if (selectedDepartment.value) {
    return teachers.value.filter(t => t.department === selectedDepartment.value)
  }
  return teachers.value
})

// Methods
const getSubjectDisplayName = (subjectId: string) => {
  const subject = subjects.value.find(s => s.id === subjectId)
  return subject ? `${subject.name}${subject.isLearningArea ? ' *' : ''}` : ''
}

const getSubjectAllocations = (subjectId: string) => {
  return allocations.value.filter(a => a.subjectId === subjectId)
}

const getTeacherAllocations = (teacherId: string) => {
  return allocations.value.filter(a => a.teacherId === teacherId)
}

const getAllocatedTeacherCount = (subjectId: string) => {
  return new Set(getSubjectAllocations(subjectId).map(a => a.teacherId)).size
}

const getRequiredTeacherCount = (subjectId: string) => {
  const subject = subjects.value.find(s => s.id === subjectId)
  return subject?.requiredTeachers || 1
}

const getTeacherName = (teacherId: string) => {
  const teacher = teachers.value.find(t => t.id === teacherId)
  return teacher?.name || ''
}

const getClassName = (classId: string) => {
  const cls = classes.value.find(c => c.id === classId)
  return cls?.name || ''
}

const getSubjectHours = (subjectId: string) => {
  const subject = subjects.value.find(s => s.id === subjectId)
  return subject?.weeklyHours || 0
}

const getTeacherAllocatedHours = (teacherId: string) => {
  return getTeacherAllocations(teacherId).reduce((total, allocation) => {
    const subject = subjects.value.find(s => s.id === allocation.subjectId)
    return total + (subject?.weeklyHours || 0)
  }, 0)
}

const getTeacherWorkloadPercentage = (teacherId: string) => {
  const teacher = teachers.value.find(t => t.id === teacherId)
  if (!teacher) return 0
  
  const allocatedHours = getTeacherAllocatedHours(teacherId)
  return Math.round((allocatedHours / teacher.maxHours) * 100)
}

const getWorkloadBarColor = (percentage: number) => {
  if (percentage < 70) return 'bg-green-500'
  if (percentage < 90) return 'bg-yellow-500'
  return 'bg-red-500'
}

const showAllocationModal = (subject: any) => {
  selectedSubject.value = subject
  allocationForm.value = {
    teacherId: '',
    classId: '',
    semester: '',
    weeklyHours: subject.weeklyHours,
    notes: ''
  }
  showAllocationModalVisible.value = true
}

const createAllocation = () => {
  const allocation = {
    id: String(allocations.value.length + 1),
    subjectId: selectedSubject.value.id,
    ...allocationForm.value,
    weeklyHours: allocationForm.value.weeklyHours || selectedSubject.value.weeklyHours
  }
  
  allocations.value.push(allocation)
  showAllocationModalVisible.value = false
  
  alert(language.value === 'de' ? 'Fach erfolgreich zugeteilt!' : 'Subject allocated successfully!')
}

const removeAllocation = (allocationId: string) => {
  if (confirm(language.value === 'de' ? 'Zuteilung entfernen?' : 'Remove allocation?')) {
    const index = allocations.value.findIndex(a => a.id === allocationId)
    if (index > -1) {
      allocations.value.splice(index, 1)
    }
  }
}
</script> 