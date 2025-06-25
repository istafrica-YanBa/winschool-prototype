<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary hover:bg-winschool-primary-dark rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Calendar class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Lernfelder im Stundenplan' : 'Learning Areas in Timetable' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Integrieren Sie Lernfelder in Referenz-Stundenpläne mit Fach-Reihenfolge' : 'Integrate learning areas into reference timetables with subject ordering' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="showCreateTimetableModal = true" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Plus class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Stundenplan erstellen' : 'Create Timetable' }}
          </button>
        </div>
      </div>

      <!-- Timetable Selection and Overview -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Referenz-Stundenpläne' : 'Reference Timetables' }}
          </h3>
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <select v-model="selectedTimetable" class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Stundenplan auswählen...' : 'Select timetable...' }}</option>
              <option v-for="timetable in timetables" :key="timetable.id" :value="timetable.id">{{ timetable.name }}</option>
            </select>
            <select v-model="selectedClass" class="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Klasse auswählen...' : 'Select class...' }}</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>
        </div>

        <div v-if="!selectedTimetable" class="text-center py-12">
          <Calendar class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ language === 'de' ? 'Stundenplan auswählen' : 'Select a Timetable' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ language === 'de' ? 'Wählen Sie einen Referenz-Stundenplan aus, um Lernfelder zu verwalten' : 'Select a reference timetable to manage learning areas' }}
          </p>
        </div>
      </div>

      <!-- Subject Order Management -->
      <div v-if="selectedTimetable" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Fach-Reihenfolge' : 'Subject Ordering' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ language === 'de' ? 'Hauptfach zuerst, dann Lernfelder. Verwenden Sie die Pfeile zum Neuordnen.' : 'Main subject first, then learning areas. Use arrows to reorder.' }}
            </p>
          </div>
          <button @click="resetToDefaultOrder" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
            {{ language === 'de' ? 'Standardreihenfolge' : 'Default Order' }}
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="subject in orderedSubjects" :key="subject.id" class="border border-gray-200 dark:border-gray-600 rounded-lg">
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                    <BookOpen class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">{{ subject.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ subject.code }} • {{ subject.weeklyHours }}h/{{ language === 'de' ? 'Woche' : 'week' }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {{ language === 'de' ? 'Position:' : 'Position:' }} {{ subject.order }}
                  </span>
                  <button @click="moveSubject(subject.id, 'up')" :disabled="subject.order === 1" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronUp class="h-4 w-4" />
                  </button>
                  <button @click="moveSubject(subject.id, 'down')" :disabled="subject.order === orderedSubjects.length" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronDown class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div class="p-4">
              <h5 class="font-medium text-gray-900 dark:text-white mb-3">
                {{ language === 'de' ? 'Zugeordnete Lernfelder' : 'Assigned Learning Areas' }}
              </h5>
              
              <div v-if="getSubjectLearningAreas(subject.id).length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                {{ language === 'de' ? 'Keine Lernfelder zugeordnet' : 'No learning areas assigned' }}
              </div>
              
              <div v-else class="space-y-2">
                <div v-for="area in getSubjectLearningAreas(subject.id)" :key="area.id" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center">
                    <div class="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                      <Target class="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h6 class="font-medium text-gray-900 dark:text-white">{{ area.name }}</h6>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ area.code }} • {{ area.weeklyHours }}h/{{ language === 'de' ? 'Woche' : 'week' }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {{ area.order }}
                    </span>
                    <button @click="moveLearningArea(area.id, 'up')" :disabled="area.order === 1" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronUp class="h-3 w-3" />
                    </button>
                    <button @click="moveLearningArea(area.id, 'down')" :disabled="isLastInSubject(area)" class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <ChevronDown class="h-3 w-3" />
                    </button>
                    <button @click="removeLearningArea(area.id)" class="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <X class="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <button @click="showAddLearningAreaModal(subject)" class="mt-3 w-full px-3 py-2 text-sm border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                {{ language === 'de' ? 'Lernfeld hinzufügen' : 'Add Learning Area' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Schedule Preview -->
      <div v-if="selectedTimetable && selectedClass" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {{ language === 'de' ? 'Wochenplan-Vorschau' : 'Weekly Schedule Preview' }}
        </h3>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ language === 'de' ? 'Zeit' : 'Time' }}
                </th>
                <th v-for="day in weekDays" :key="day" class="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="period in timePeriods" :key="period.id" class="border-b border-gray-100 dark:border-gray-700">
                <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ period.time }}</td>
                <td v-for="day in weekDays" :key="day" class="py-3 px-4 text-center">
                  <div v-if="getScheduleItem(period.id, day)" class="bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2">
                    <div class="text-sm font-medium text-blue-900 dark:text-blue-100">{{ getScheduleItem(period.id, day)?.subject }}</div>
                    <div v-if="getScheduleItem(period.id, day)?.learningArea" class="text-xs text-blue-700 dark:text-blue-300">{{ getScheduleItem(period.id, day)?.learningArea }}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Learning Area Modal -->
      <div v-if="showAddAreaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Lernfeld hinzufügen' : 'Add Learning Area' }}
            </h3>
            <button @click="showAddAreaModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="p-6">
            <div class="mb-4">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {{ language === 'de' ? `Lernfeld zu "${selectedSubjectForArea?.name}" hinzufügen:` : `Add learning area to "${selectedSubjectForArea?.name}":` }}
              </p>
              <select v-model="selectedAreaToAdd" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">{{ language === 'de' ? 'Lernfeld auswählen...' : 'Select learning area...' }}</option>
                <option v-for="area in availableLearningAreas" :key="area.id" :value="area.id">{{ area.name }} ({{ area.code }})</option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button @click="showAddAreaModal = false" class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button @click="addLearningAreaToSubject" :disabled="!selectedAreaToAdd" class="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {{ language === 'de' ? 'Hinzufügen' : 'Add' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Timetable Modal -->
      <div v-if="showCreateTimetableModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Neuen Stundenplan erstellen' : 'Create New Timetable' }}
            </h3>
            <button @click="showCreateTimetableModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <form @submit.prevent="createTimetable" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Stundenplan-Name' : 'Timetable Name' }} <span class="text-red-500">*</span>
                </label>
                <input v-model="newTimetable.name" type="text" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ language === 'de' ? 'Schuljahr' : 'Academic Year' }} <span class="text-red-500">*</span>
                </label>
                <select v-model="newTimetable.academicYear" required class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="">{{ language === 'de' ? 'Jahr auswählen...' : 'Select year...' }}</option>
                  <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ language === 'de' ? 'Beschreibung' : 'Description' }}
              </label>
              <textarea v-model="newTimetable.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
            </div>
            
            <div class="flex items-center">
              <input v-model="newTimetable.isTemplate" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {{ language === 'de' ? 'Als Vorlage verwenden' : 'Use as template' }}
              </label>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button type="button" @click="showCreateTimetableModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg">
                {{ language === 'de' ? 'Abbrechen' : 'Cancel' }}
              </button>
              <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 rounded-lg">
                {{ language === 'de' ? 'Stundenplan erstellen' : 'Create Timetable' }}
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
import { 
  Calendar, Plus, BookOpen, Target, ChevronUp, ChevronDown, X
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const selectedTimetable = ref('')
const selectedClass = ref('')
const showAddAreaModal = ref(false)
const showCreateTimetableModal = ref(false)
const selectedSubjectForArea = ref<any>(null)
const selectedAreaToAdd = ref('')

// Form data
const newTimetable = ref({
  name: '',
  academicYear: '',
  description: '',
  isTemplate: false
})

// Mock data
const academicYears = ref(['2023-2024', '2024-2025', '2025-2026'])

const classes = ref([
  { id: '1', name: 'Grade 10A' },
  { id: '2', name: 'Grade 10B' },
  { id: '3', name: 'Grade 11A' },
  { id: '4', name: 'Grade 11B' }
])

const timetables = ref([
  { id: '1', name: 'Standard Timetable 2024', academicYear: '2023-2024', isTemplate: true },
  { id: '2', name: 'Science Track Timetable', academicYear: '2023-2024', isTemplate: false },
  { id: '3', name: 'Arts Track Timetable', academicYear: '2023-2024', isTemplate: false }
])

const subjects = ref([
  { id: '1', name: 'Mathematics', code: 'MATH', weeklyHours: 6, order: 1 },
  { id: '2', name: 'Science', code: 'SCI', weeklyHours: 5, order: 2 },
  { id: '3', name: 'Languages', code: 'LANG', weeklyHours: 4, order: 3 },
  { id: '4', name: 'Social Studies', code: 'SOC', weeklyHours: 3, order: 4 }
])

const learningAreas = ref([
  { id: '1', name: 'Algebra', code: 'MA-ALG-01', subjectId: '1', weeklyHours: 3, order: 1 },
  { id: '2', name: 'Geometry', code: 'MA-GEO-01', subjectId: '1', weeklyHours: 2, order: 2 },
  { id: '3', name: 'Statistics', code: 'MA-STA-01', subjectId: '1', weeklyHours: 1, order: 3 },
  { id: '4', name: 'Physics', code: 'SC-PHY-01', subjectId: '2', weeklyHours: 3, order: 1 },
  { id: '5', name: 'Chemistry', code: 'SC-CHE-01', subjectId: '2', weeklyHours: 2, order: 2 }
])

const weekDays = computed(() => language.value === 'de' 
  ? ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag']
  : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
)

const timePeriods = ref([
  { id: '1', time: '08:00-08:45' },
  { id: '2', time: '08:45-09:30' },
  { id: '3', time: '09:45-10:30' },
  { id: '4', time: '10:30-11:15' },
  { id: '5', time: '11:30-12:15' },
  { id: '6', time: '12:15-13:00' }
])

// Mock schedule data
const schedule = ref([
  { periodId: '1', day: 'Monday', subject: 'Mathematics', learningArea: 'Algebra' },
  { periodId: '2', day: 'Monday', subject: 'Science', learningArea: 'Physics' },
  { periodId: '1', day: 'Tuesday', subject: 'Languages', learningArea: null },
  { periodId: '2', day: 'Tuesday', subject: 'Mathematics', learningArea: 'Geometry' }
])

// Computed
const orderedSubjects = computed(() => {
  return subjects.value.sort((a, b) => a.order - b.order)
})

const availableLearningAreas = computed(() => {
  if (!selectedSubjectForArea.value) return []
  return learningAreas.value.filter(area => 
    area.subjectId === selectedSubjectForArea.value.id &&
    !getSubjectLearningAreas(selectedSubjectForArea.value.id).some(assigned => assigned.id === area.id)
  )
})

// Methods
const getSubjectLearningAreas = (subjectId: string) => {
  return learningAreas.value
    .filter(area => area.subjectId === subjectId)
    .sort((a, b) => a.order - b.order)
}

const getScheduleItem = (periodId: string, day: string) => {
  const dayKey = weekDays.value.indexOf(day) !== -1 ? 
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][weekDays.value.indexOf(day)] : day
  return schedule.value.find(item => item.periodId === periodId && item.day === dayKey)
}

const moveSubject = (subjectId: string, direction: 'up' | 'down') => {
  const subject = subjects.value.find(s => s.id === subjectId)
  if (!subject) return

  const targetOrder = direction === 'up' ? subject.order - 1 : subject.order + 1
  const targetSubject = subjects.value.find(s => s.order === targetOrder)

  if (targetSubject) {
    const tempOrder = subject.order
    subject.order = targetSubject.order
    targetSubject.order = tempOrder
  }
}

const moveLearningArea = (areaId: string, direction: 'up' | 'down') => {
  const area = learningAreas.value.find(a => a.id === areaId)
  if (!area) return

  const subjectAreas = getSubjectLearningAreas(area.subjectId)
  const currentIndex = subjectAreas.findIndex(a => a.id === areaId)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (targetIndex >= 0 && targetIndex < subjectAreas.length) {
    const targetArea = subjectAreas[targetIndex]
    const tempOrder = area.order
    area.order = targetArea.order
    targetArea.order = tempOrder
  }
}

const isLastInSubject = (area: any) => {
  const subjectAreas = getSubjectLearningAreas(area.subjectId)
  return area.order === Math.max(...subjectAreas.map(a => a.order))
}

const removeLearningArea = (areaId: string) => {
  if (confirm(language.value === 'de' ? 'Lernfeld aus Stundenplan entfernen?' : 'Remove learning area from timetable?')) {
    const areaIndex = learningAreas.value.findIndex(a => a.id === areaId)
    if (areaIndex > -1) {
      learningAreas.value.splice(areaIndex, 1)
    }
  }
}

const showAddLearningAreaModal = (subject: any) => {
  selectedSubjectForArea.value = subject
  selectedAreaToAdd.value = ''
  showAddAreaModal.value = true
}

const addLearningAreaToSubject = () => {
  if (selectedAreaToAdd.value && selectedSubjectForArea.value) {
    const area = learningAreas.value.find(a => a.id === selectedAreaToAdd.value)
    if (area) {
      // Create a copy assigned to the subject
      const maxOrder = Math.max(...getSubjectLearningAreas(selectedSubjectForArea.value.id).map(a => a.order), 0)
      const newArea = {
        ...area,
        id: `${area.id}-${Date.now()}`,
        subjectId: selectedSubjectForArea.value.id,
        order: maxOrder + 1
      }
      learningAreas.value.push(newArea)
    }
    showAddAreaModal.value = false
  }
}

const resetToDefaultOrder = () => {
  if (confirm(language.value === 'de' ? 'Zur Standardreihenfolge zurückkehren?' : 'Reset to default order?')) {
    subjects.value.forEach((subject, index) => {
      subject.order = index + 1
    })
    
    // Reset learning area orders within each subject
    subjects.value.forEach(subject => {
      const subjectAreas = getSubjectLearningAreas(subject.id)
      subjectAreas.forEach((area, index) => {
        area.order = index + 1
      })
    })
  }
}

const createTimetable = () => {
  const timetable = {
    id: String(timetables.value.length + 1),
    ...newTimetable.value
  }
  
  timetables.value.push(timetable)
  
  // Reset form
  newTimetable.value = {
    name: '',
    academicYear: '',
    description: '',
    isTemplate: false
  }
  
  showCreateTimetableModal.value = false
  selectedTimetable.value = timetable.id
}
</script> 