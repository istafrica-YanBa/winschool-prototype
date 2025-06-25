<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Wahlpflichtfächer' : 'Elective Courses' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ language === 'de' ? 'Verwalten Sie Wahlpflichtfächer und Schülerauswahl' : 'Manage elective courses and student selections' }}
        </p>
      </div>
      <button @click="showCourseModal = true" class="btn-primary flex items-center">
        <Plus class="h-4 w-4 mr-2" />
        {{ language === 'de' ? 'Neues Wahlfach' : 'New Elective' }}
      </button>
    </div>

    <!-- Selection Period Status -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Wahlperiode Status' : 'Selection Period Status' }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ language === 'de' ? 'Aktueller Zeitraum: Sommersemester 2024' : 'Current Period: Summer Semester 2024' }}
          </p>
        </div>
        <div class="flex space-x-2">
          <span :class="selectionPeriodActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'" class="px-3 py-1 text-sm font-medium rounded-full">
            {{ selectionPeriodActive ? (language === 'de' ? 'Aktiv' : 'Active') : (language === 'de' ? 'Geschlossen' : 'Closed') }}
          </span>
          <button @click="toggleSelectionPeriod" class="btn-secondary text-sm">
            {{ selectionPeriodActive ? (language === 'de' ? 'Schließen' : 'Close') : (language === 'de' ? 'Öffnen' : 'Open') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Elective Courses Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in electiveCourses" :key="course.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">{{ course.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ course.teacher }}</p>
          </div>
          <span :class="getCourseStatusColor(course.status)" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ course.status }}
          </span>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ course.description }}</p>

        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Anmeldungen' : 'Enrollments' }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ course.enrolled }}/{{ course.maxStudents }}</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div class="bg-primary-600 h-2 rounded-full" :style="{ width: (course.enrolled / course.maxStudents * 100) + '%' }"></div>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Klassenstufe' : 'Grade Level' }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ course.gradeLevel }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Wochenstunden' : 'Weekly Hours' }}</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ course.weeklyHours }}h</span>
          </div>
        </div>

        <div class="flex space-x-2">
          <button @click="viewCourseDetails(course)" class="flex-1 px-3 py-2 text-sm bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200 transition-colors">
            {{ language === 'de' ? 'Details' : 'Details' }}
          </button>
          <button @click="editCourse(course)" class="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
            <Edit class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Student Selection Overview -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ language === 'de' ? 'Schülerauswahl Übersicht' : 'Student Selection Overview' }}
        </h2>
        <div class="flex space-x-2">
          <select v-model="selectedGrade" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="">{{ language === 'de' ? 'Alle Klassenstufen' : 'All Grade Levels' }}</option>
            <option v-for="grade in gradeLevels" :key="grade" :value="grade">{{ grade }}</option>
          </select>
          <button @click="exportSelections" class="btn-secondary text-sm">
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Schüler' : 'Student' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Klasse' : 'Class' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Erstwahl' : 'First Choice' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Zweitwahl' : 'Second Choice' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Status' : 'Status' }}
              </th>
              <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Aktionen' : 'Actions' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="selection in filteredSelections" :key="selection.id" class="border-b border-gray-100 dark:border-gray-700">
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img :src="selection.studentAvatar" :alt="selection.studentName" class="h-8 w-8 rounded-full object-cover mr-3" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ selection.studentName }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ selection.class }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ selection.firstChoice }}</td>
              <td class="py-3 px-4 text-gray-900 dark:text-white">{{ selection.secondChoice }}</td>
              <td class="py-3 px-4">
                <span :class="getSelectionStatusColor(selection.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ selection.status }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex space-x-2">
                  <button @click="approveSelection(selection)" class="text-green-600 hover:text-green-800">
                    <Check class="h-4 w-4" />
                  </button>
                  <button @click="editSelection(selection)" class="text-primary-600 hover:text-primary-800">
                    <Edit class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Course Modal -->
    <div v-if="showCourseModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neues Wahlpflichtfach' : 'New Elective Course' }}
            </h3>
            <button @click="showCourseModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>

          <form @submit.prevent="createCourse" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Kursname' : 'Course Name' }}
              </label>
              <input
                v-model="courseForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea
                v-model="courseForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Klassenstufe' : 'Grade Level' }}
                </label>
                <select
                  v-model="courseForm.gradeLevel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Wählen' : 'Select' }}</option>
                  <option v-for="grade in gradeLevels" :key="grade" :value="grade">{{ grade }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Max. Schüler' : 'Max Students' }}
                </label>
                <input
                  v-model="courseForm.maxStudents"
                  type="number"
                  min="1"
                  max="30"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Lehrer' : 'Teacher' }}
                </label>
                <select
                  v-model="courseForm.teacher"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Wählen' : 'Select' }}</option>
                  <option value="Dr. Weber">Dr. Weber</option>
                  <option value="Ms. Schmidt">Ms. Schmidt</option>
                  <option value="Prof. Mueller">Prof. Mueller</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Wochenstunden' : 'Weekly Hours' }}
                </label>
                <input
                  v-model="courseForm.weeklyHours"
                  type="number"
                  min="1"
                  max="10"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div class="flex justify-end space-x-3">
              <button type="button" @click="showCourseModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="btn-primary">
                {{ language === 'de' ? 'Kurs erstellen' : 'Create Course' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Plus, Edit, Check, X } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const showCourseModal = ref(false)
const selectionPeriodActive = ref(true)
const selectedGrade = ref('')

const courseForm = ref({
  name: '',
  description: '',
  gradeLevel: '',
  maxStudents: 20,
  teacher: '',
  weeklyHours: 2
})

const gradeLevels = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']

const electiveCourses = ref([
  {
    id: 1,
    name: 'Advanced Programming',
    description: 'Learn Python and web development fundamentals',
    teacher: 'Dr. Weber',
    gradeLevel: 'Grade 11',
    maxStudents: 20,
    enrolled: 18,
    weeklyHours: 3,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Creative Writing',
    description: 'Develop your writing skills through various genres',
    teacher: 'Ms. Schmidt',
    gradeLevel: 'Grade 10',
    maxStudents: 15,
    enrolled: 12,
    weeklyHours: 2,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Environmental Science',
    description: 'Explore ecology and environmental conservation',
    teacher: 'Prof. Mueller',
    gradeLevel: 'Grade 12',
    maxStudents: 25,
    enrolled: 8,
    weeklyHours: 2,
    status: 'Low Enrollment'
  }
])

const studentSelections = ref([
  {
    id: 1,
    studentName: 'Emma Müller',
    studentAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    class: 'Class 11A',
    firstChoice: 'Advanced Programming',
    secondChoice: 'Environmental Science',
    status: 'Pending'
  },
  {
    id: 2,
    studentName: 'Liam Weber',
    studentAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    class: 'Class 10B',
    firstChoice: 'Creative Writing',
    secondChoice: 'Advanced Programming',
    status: 'Approved'
  }
])

const filteredSelections = computed(() => {
  if (!selectedGrade.value) return studentSelections.value
  return studentSelections.value.filter(selection => 
    selection.class.includes(selectedGrade.value.replace('Grade ', ''))
  )
})

const toggleSelectionPeriod = () => {
  selectionPeriodActive.value = !selectionPeriodActive.value
}

const createCourse = () => {
  electiveCourses.value.push({
    id: electiveCourses.value.length + 1,
    ...courseForm.value,
    enrolled: 0,
    status: 'Active'
  })
  
  showCourseModal.value = false
  courseForm.value = {
    name: '',
    description: '',
    gradeLevel: '',
    maxStudents: 20,
    teacher: '',
    weeklyHours: 2
  }
}

const viewCourseDetails = (course: any) => {
  alert(`${language.value === 'de' ? 'Kursdetails für' : 'Course details for'}: ${course.name}`)
}

const editCourse = (course: any) => {
  alert(`${language.value === 'de' ? 'Kurs bearbeiten' : 'Edit course'}: ${course.name}`)
}

const approveSelection = (selection: any) => {
  selection.status = 'Approved'
}

const editSelection = (selection: any) => {
  alert(`${language.value === 'de' ? 'Auswahl bearbeiten für' : 'Edit selection for'}: ${selection.studentName}`)
}

const exportSelections = () => {
  alert(language.value === 'de' ? 'Auswahlen exportiert!' : 'Selections exported!')
}

const getCourseStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Low Enrollment':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Full':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getSelectionStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}
</script>
