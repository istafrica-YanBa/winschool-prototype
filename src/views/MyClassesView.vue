<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Users class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Meine Klassen' : 'My Classes' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Verwalten Sie Ihre Klassen und Schüler' : 'Manage your classes and students' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showCreateAssessment = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Bewertung erstellen' : 'Create Assessment' }}
          </button>
        </div>
      </div>

      <!-- Class Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="classData in myClasses" :key="classData.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 card-hover cursor-pointer" @click="selectClass(classData)">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ classData.name }}</h3>
            <span :class="getPerformanceColor(classData.averageGrade)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ classData.averageGrade }}
            </span>
          </div>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Schüler' : 'Students' }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ classData.studentCount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</span>
              <span class="font-medium text-green-600">{{ classData.attendanceRate }}%</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Nächste Stunde' : 'Next Class' }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ classData.nextClass }}</span>
            </div>
          </div>

          <!-- Performance Meter -->
          <div class="mt-4">
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>{{ language === 'de' ? 'Klassenleistung' : 'Class Performance' }}</span>
              <span>{{ classData.performancePercentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div :class="getPerformanceBarColor(classData.averageGrade)" class="h-2 rounded-full" :style="{ width: classData.performancePercentage + '%' }"></div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mt-4">
            <button @click.stop="selectClass(classData)" class="w-full px-3 py-2 text-sm bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 rounded-lg transition-colors font-medium">
              {{ language === 'de' ? 'Klasse anzeigen' : 'View Class' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Selected Class Details -->
      <div v-if="selectedClass" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ selectedClass.name }} - {{ language === 'de' ? 'Schülerliste' : 'Student List' }}
          </h2>
          <div class="flex space-x-2">
            <button @click="takeAttendance(selectedClass)" class="btn-secondary text-sm">
              {{ language === 'de' ? 'Anwesenheit markieren' : 'Take Attendance' }}
            </button>
            <button @click="exportClassData" class="btn-secondary text-sm">
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
                  {{ language === 'de' ? 'Aktuelle Note' : 'Current Grade' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Letzte Bewertung' : 'Last Assessment' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Aktionen' : 'Actions' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in selectedClass.students" :key="student.id" class="border-b border-gray-100 dark:border-gray-700">
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img :src="student.avatar" :alt="student.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                    <span class="font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span :class="getGradeColor(student.currentGrade)" class="font-semibold">{{ student.currentGrade }}</span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-green-600 font-medium">{{ student.attendanceRate }}%</span>
                </td>
                <td class="py-3 px-4 text-gray-600 dark:text-gray-400">{{ student.lastAssessment }}</td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button @click="viewStudentProfile(student)" class="text-primary-600 hover:text-primary-800">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="gradeStudent(student)" class="text-secondary-600 hover:text-secondary-800">
                      <Edit class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Attendance Modal -->
      <div v-if="showAttendanceModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Anwesenheit markieren' : 'Take Attendance' }} - {{ attendanceClass?.name }}
              </h3>
              <button @click="showAttendanceModal = false" class="text-gray-400 hover:text-gray-600">
                <X class="h-6 w-6" />
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="student in attendanceClass?.students" :key="student.id" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="flex items-center">
                  <img :src="student.avatar" :alt="student.name" class="h-8 w-8 rounded-full object-cover mr-3" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ student.name }}</span>
                </div>
                <div class="flex space-x-2">
                  <label class="flex items-center">
                    <input
                      v-model="student.attendance"
                      type="radio"
                      :value="'present'"
                      :name="`attendance-${student.id}`"
                      class="mr-2 text-green-600"
                    />
                    <span class="text-sm text-green-600">{{ language === 'de' ? 'Anwesend' : 'Present' }}</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="student.attendance"
                      type="radio"
                      :value="'absent'"
                      :name="`attendance-${student.id}`"
                      class="mr-2 text-red-600"
                    />
                    <span class="text-sm text-red-600">{{ language === 'de' ? 'Abwesend' : 'Absent' }}</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="student.attendance"
                      type="radio"
                      :value="'late'"
                      :name="`attendance-${student.id}`"
                      class="mr-2 text-yellow-600"
                    />
                    <span class="text-sm text-yellow-600">{{ language === 'de' ? 'Verspätet' : 'Late' }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Notizen' : 'Notes' }}
              </label>
              <textarea
                v-model="attendanceNotes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                :placeholder="language === 'de' ? 'Zusätzliche Notizen zur Anwesenheit...' : 'Additional attendance notes...'"
              ></textarea>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button @click="showAttendanceModal = false" class="btn-secondary">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button @click="saveAttendance" class="btn-primary">
                {{ language === 'de' ? 'Anwesenheit speichern' : 'Save Attendance' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Assessment Modal -->
      <div v-if="showCreateAssessment" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Neue Bewertung erstellen' : 'Create New Assessment' }}
              </h3>
              <button @click="showCreateAssessment = false" class="text-gray-400 hover:text-gray-600">
                <X class="h-6 w-6" />
              </button>
            </div>

            <form @submit.prevent="createAssessment" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Bewertungstyp' : 'Assessment Type' }}
                </label>
                <select
                  v-model="assessmentForm.type"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Typ wählen' : 'Select Type' }}</option>
                  <option value="test">{{ language === 'de' ? 'Test' : 'Test' }}</option>
                  <option value="homework">{{ language === 'de' ? 'Hausaufgabe' : 'Homework' }}</option>
                  <option value="assignment">{{ language === 'de' ? 'Aufgabe' : 'Assignment' }}</option>
                  <option value="exam">{{ language === 'de' ? 'Prüfung' : 'Exam' }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Titel' : 'Title' }}
                </label>
                <input
                  v-model="assessmentForm.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  :placeholder="language === 'de' ? 'z.B. Mathematik Kapitel 5 Test' : 'e.g. Mathematics Chapter 5 Test'"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Klasse' : 'Class' }}
                </label>
                <select
                  v-model="assessmentForm.classId"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{{ language === 'de' ? 'Klasse wählen' : 'Select Class' }}</option>
                  <option v-for="class_ in myClasses" :key="class_.id" :value="class_.id">{{ class_.name }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Fälligkeitsdatum' : 'Due Date' }}
                </label>
                <input
                  v-model="assessmentForm.dueDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Beschreibung' : 'Description' }}
                </label>
                <textarea
                  v-model="assessmentForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  :placeholder="language === 'de' ? 'Bewertungsdetails...' : 'Assessment details...'"
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3">
                <button type="button" @click="showCreateAssessment = false" class="btn-secondary">
                  {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                </button>
                <button type="submit" class="btn-primary">
                  {{ language === 'de' ? 'Bewertung erstellen' : 'Create Assessment' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Grade Student Modal -->
      <div v-if="showGradeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ language === 'de' ? 'Schüler bewerten' : 'Grade Student' }}
              </h3>
              <button @click="showGradeModal = false" class="text-gray-400 hover:text-gray-600">
                <X class="h-6 w-6" />
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ language === 'de' ? 'Note' : 'Grade' }}
                </label>
                <input 
                  type="number" 
                  v-model="gradeValue"
                  min="1"
                  max="6"
                  step="0.5"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {{ language === 'de' ? 'Kommentar' : 'Comment' }}
                </label>
                <textarea 
                  v-model="gradeComment"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3">
                <button 
                  @click="showGradeModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
                </button>
                <button 
                  @click="submitGrade"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  {{ language === 'de' ? 'Speichern' : 'Save' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useRouter } from 'vue-router'
import { 
  Plus, Eye, Edit, X, ChevronDown, Calendar, Download, Users
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)
const router = useRouter()

// Search and filters
const searchQuery = ref('')
const selectedClassFilter = ref('')
const selectedSubject = ref('')

// Dropdowns
const showActionsDropdown = ref(false)
const actionsDropdownRef = ref<HTMLElement | null>(null)

// Modals
const showGradeModal = ref(false)

// Selected items
const selectedStudent = ref<any>(null)
const gradeValue = ref(4)
const gradeComment = ref('')

const selectedClass = ref<any>(null)
const showAttendanceModal = ref(false)
const showCreateAssessment = ref(false)
const attendanceClass = ref<any>(null)
const attendanceNotes = ref('')

const assessmentForm = ref({
  type: '',
  title: '',
  classId: '',
  dueDate: '',
  description: ''
})

const myClasses = ref([
  {
    id: 1,
    name: 'Mathematics 10A',
    subject: 'Mathematics',
    studentCount: 28,
    averageGrade: 'B+',
    attendanceRate: 94,
    performancePercentage: 85,
    nextClass: 'Today 10:00',
    students: [
      {
        id: 1,
        name: 'Emma Müller',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        currentGrade: 'A-',
        attendanceRate: 96,
        lastAssessment: 'Algebra Test',
        attendance: 'present'
      },
      {
        id: 2,
        name: 'Liam Weber',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        currentGrade: 'B+',
        attendanceRate: 92,
        lastAssessment: 'Geometry Quiz',
        attendance: 'present'
      },
      {
        id: 3,
        name: 'Sophie Schmidt',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        currentGrade: 'A',
        attendanceRate: 98,
        lastAssessment: 'Calculus Assignment',
        attendance: 'present'
      }
    ]
  },
  {
    id: 2,
    name: 'Mathematics 10B',
    subject: 'Mathematics',
    studentCount: 25,
    averageGrade: 'A-',
    attendanceRate: 96,
    performancePercentage: 88,
    nextClass: 'Tomorrow 9:00',
    students: [
      {
        id: 4,
        name: 'Noah Fischer',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        currentGrade: 'B',
        attendanceRate: 89,
        lastAssessment: 'Statistics Test',
        attendance: 'present'
      }
    ]
  },
  {
    id: 3,
    name: 'Advanced Calculus 12A',
    subject: 'Mathematics',
    studentCount: 18,
    averageGrade: 'A',
    attendanceRate: 98,
    performancePercentage: 92,
    nextClass: 'Friday 11:00',
    students: [
      {
        id: 5,
        name: 'Mia Wagner',
        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        currentGrade: 'A',
        attendanceRate: 100,
        lastAssessment: 'Derivatives Quiz',
        attendance: 'present'
      }
    ]
  }
])

const selectClass = (classData: any) => {
  router.push(`/dashboard/class-detail/${classData.id}`)
}

const takeAttendance = (classData: any) => {
  attendanceClass.value = classData
  showAttendanceModal.value = true
}

const gradeClass = (classData: any) => {
  alert(`${language.value === 'de' ? 'Bewertung für Klasse' : 'Grading class'} ${classData.name}`)
}

const viewStudentProfile = (student: any) => {
  router.push(`/dashboard/student-profile/${student.id}`)
}

const gradeStudent = (student: any) => {
  selectedStudent.value = student
  showGradeModal.value = true
}

const saveAttendance = () => {
  showAttendanceModal.value = false
  attendanceNotes.value = ''
  alert(language.value === 'de' ? 'Anwesenheit gespeichert!' : 'Attendance saved!')
}

const createAssessment = () => {
  showCreateAssessment.value = false
  assessmentForm.value = { type: '', title: '', classId: '', dueDate: '', description: '' }
  alert(language.value === 'de' ? 'Bewertung erstellt!' : 'Assessment created!')
}

const exportClassData = () => {
  alert(language.value === 'de' ? 'Klassendaten exportiert!' : 'Class data exported!')
}

const getPerformanceColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const getPerformanceBarColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-500'
  if (grade.startsWith('B')) return 'bg-blue-500'
  if (grade.startsWith('C')) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400'
  if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400'
  if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const submitGrade = () => {
  showGradeModal.value = false
  alert(language.value === 'de' ? 'Note gespeichert!' : 'Grade saved!')
}
</script>
