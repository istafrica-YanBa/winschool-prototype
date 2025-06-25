<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary hover:bg-winschool-primary-dark rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <ClipboardCheck class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Lernfeld-Bewertungen' : 'Learning Field Assessments' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Noten für Lernfelder pro Schüler und Klasse eingeben' : 'Enter grades for learning fields per student and class' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="exportGrades" class="w-full sm:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Download class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Exportieren' : 'Export' }}
          </button>
          <button @click="saveGrades" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Save class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Noten speichern' : 'Save Grades' }}
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Klasse' : 'Class' }}
            </label>
            <select v-model="selectedClass" @change="loadStudents" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Klasse auswählen...' : 'Select class...' }}</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Bewertungsperiode' : 'Assessment Period' }}
            </label>
            <select v-model="selectedPeriod" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option v-for="period in assessmentPeriods" :key="period.id" :value="period.id">{{ period.name }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Hauptfach-Filter' : 'Subject Filter' }}
            </label>
            <select v-model="selectedSubjectFilter" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="">{{ language === 'de' ? 'Alle Fächer' : 'All Subjects' }}</option>
              <option v-for="subject in mainSubjects" :key="subject.id" :value="subject.id">{{ subject.name }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ language === 'de' ? 'Ansicht' : 'View Mode' }}
            </label>
            <select v-model="viewMode" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="student">{{ language === 'de' ? 'Nach Schüler' : 'By Student' }}</option>
              <option value="field">{{ language === 'de' ? 'Nach Lernfeld' : 'By Learning Field' }}</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="!selectedClass" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
        <AlertTriangle class="h-12 w-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          {{ language === 'de' ? 'Klasse auswählen' : 'Select a Class' }}
        </h3>
        <p class="text-yellow-700 dark:text-yellow-300">
          {{ language === 'de' ? 'Bitte wählen Sie eine Klasse aus, um mit der Bewertung zu beginnen.' : 'Please select a class to start grading.' }}
        </p>
      </div>

      <!-- Assessment Grid - By Student View -->
      <div v-if="selectedClass && viewMode === 'student'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Bewertungen nach Schüler' : 'Assessments by Student' }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ selectedClassName }} - {{ selectedPeriodName }}
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-900 z-10">
                  {{ language === 'de' ? 'Schüler' : 'Student' }}
                </th>
                <th v-for="subject in filteredSubjects" :key="subject.id" class="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" :colspan="getSubjectFieldCount(subject.id)">
                  {{ subject.name }}
                </th>
              </tr>
              <tr class="bg-gray-50 dark:bg-gray-900">
                <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 sticky left-0 bg-gray-50 dark:bg-gray-900 z-10">
                  <!-- Empty for student names -->
                </th>
                <template v-for="subject in filteredSubjects" :key="`fields-${subject.id}`">
                  <th v-for="field in getSubjectLearningFields(subject.id)" :key="field.id" class="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    <div class="flex flex-col items-center">
                      <span class="truncate max-w-24">{{ field.name }}</span>
                      <span class="text-xs text-gray-400 dark:text-gray-500">{{ field.code }}</span>
                    </div>
                  </th>
                </template>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="student in students" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-700">
                  <div class="flex items-center">
                    <img :src="student.avatar" :alt="student.name" class="h-8 w-8 rounded-full mr-3" />
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ student.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ student.studentId }}</div>
                    </div>
                  </div>
                </td>
                <template v-for="subject in filteredSubjects" :key="`grades-${subject.id}-${student.id}`">
                  <td v-for="field in getSubjectLearningFields(subject.id)" :key="`grade-${field.id}-${student.id}`" class="px-2 py-4 text-center">
                    <input
                      v-model="grades[`${student.id}-${field.id}`]"
                      type="text"
                      :placeholder="gradeScale.placeholder"
                      class="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      @input="markAsModified(`${student.id}-${field.id}`)"
                    />
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Assessment Grid - By Learning Field View -->
      <div v-if="selectedClass && viewMode === 'field'" class="space-y-6">
        <div v-for="subject in filteredSubjects" :key="subject.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ subject.name }}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ getSubjectLearningFields(subject.id).length }} {{ language === 'de' ? 'Lernfelder' : 'Learning Fields' }}</p>
                </div>
              </div>
              <button @click="toggleSubjectExpansion(subject.id)" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <ChevronDown v-if="expandedSubjects.includes(subject.id)" class="h-5 w-5 text-gray-500" />
                <ChevronRight v-else class="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div v-if="expandedSubjects.includes(subject.id)" class="p-6 space-y-6">
            <div v-for="field in getSubjectLearningFields(subject.id)" :key="field.id" class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <div class="p-4 bg-slate-50 dark:bg-slate-700 border-b border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                      <Target class="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">{{ field.name }}</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ field.code }} • {{ field.weeklyHours }}h/{{ language === 'de' ? 'Woche' : 'week' }}</p>
                    </div>
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ students.length }} {{ language === 'de' ? 'Schüler' : 'Students' }}
                  </div>
                </div>
              </div>

              <div class="p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div v-for="student in students" :key="student.id" class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div class="flex items-center flex-1">
                      <img :src="student.avatar" :alt="student.name" class="h-8 w-8 rounded-full mr-3" />
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ student.name }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ student.studentId }}</p>
                      </div>
                    </div>
                    <div class="ml-3">
                      <input
                        v-model="grades[`${student.id}-${field.id}`]"
                        type="text"
                        :placeholder="gradeScale.placeholder"
                        class="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        @input="markAsModified(`${student.id}-${field.id}`)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Summary -->
      <div v-if="selectedClass" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Users class="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Schüler' : 'Students' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ students.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <Target class="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Lernfelder' : 'Learning Fields' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalLearningFields }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <ClipboardCheck class="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Eingegeben' : 'Graded' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ gradedCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
              <Percent class="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ language === 'de' ? 'Fortschritt' : 'Progress' }}
              </p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ progressPercentage }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useThemeStore } from '../stores/theme'
import { 
  ClipboardCheck, Save, AlertTriangle, BookOpen, Target, Users, Percent,
  ChevronDown, ChevronRight, Download
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// State
const selectedClass = ref('')
const selectedPeriod = ref('q1')
const selectedSubjectFilter = ref('')
const viewMode = ref<'student' | 'field'>('student')
const expandedSubjects = ref<string[]>([])
const grades = ref<Record<string, string>>({})
const modifiedGrades = ref<Set<string>>(new Set())

// Mock data
const classes = ref([
  { id: '1', name: 'Grade 10A' },
  { id: '2', name: 'Grade 10B' },
  { id: '3', name: 'Grade 11A' },
  { id: '4', name: 'Grade 11B' }
])

const assessmentPeriods = ref([
  { id: 'q1', name: language.value === 'de' ? '1. Quartal' : 'Quarter 1' },
  { id: 'q2', name: language.value === 'de' ? '2. Quartal' : 'Quarter 2' },
  { id: 'q3', name: language.value === 'de' ? '3. Quartal' : 'Quarter 3' },
  { id: 'q4', name: language.value === 'de' ? '4. Quartal' : 'Quarter 4' },
  { id: 'mid', name: language.value === 'de' ? 'Halbjahr' : 'Mid-Year' },
  { id: 'final', name: language.value === 'de' ? 'Endjahr' : 'Final' }
])

const mainSubjects = ref([
  { id: '1', name: 'Mathematics', code: 'MATH' },
  { id: '2', name: 'Science', code: 'SCI' },
  { id: '3', name: 'Languages', code: 'LANG' },
  { id: '4', name: 'Social Studies', code: 'SOC' }
])

const learningFields = ref([
  { id: '1', name: 'Algebra', code: 'MA-ALG-01', mainSubjectId: '1', weeklyHours: 3 },
  { id: '2', name: 'Geometry', code: 'MA-GEO-01', mainSubjectId: '1', weeklyHours: 2 },
  { id: '3', name: 'Physics', code: 'SC-PHY-01', mainSubjectId: '2', weeklyHours: 3 },
  { id: '4', name: 'Chemistry', code: 'SC-CHE-01', mainSubjectId: '2', weeklyHours: 2 },
  { id: '5', name: 'Biology', code: 'SC-BIO-01', mainSubjectId: '2', weeklyHours: 2 }
])

const students = ref([
  { id: '1', name: 'Emma Wilson', studentId: 'S001', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'James Smith', studentId: 'S002', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Sophie Johnson', studentId: 'S003', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Michael Brown', studentId: 'S004', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: '5', name: 'Emily Davis', studentId: 'S005', avatar: 'https://i.pravatar.cc/150?img=5' }
])

const gradeScale = ref({
  type: 'letter', // or 'numeric', 'percentage'
  placeholder: 'A-F',
  min: 'F',
  max: 'A'
})

// Computed
const selectedClassName = computed(() => {
  const cls = classes.value.find(c => c.id === selectedClass.value)
  return cls ? cls.name : ''
})

const selectedPeriodName = computed(() => {
  const period = assessmentPeriods.value.find(p => p.id === selectedPeriod.value)
  return period ? period.name : ''
})

const filteredSubjects = computed(() => {
  if (selectedSubjectFilter.value) {
    return mainSubjects.value.filter(s => s.id === selectedSubjectFilter.value)
  }
  return mainSubjects.value
})

const totalLearningFields = computed(() => {
  return filteredSubjects.value.reduce((total, subject) => {
    return total + getSubjectLearningFields(subject.id).length
  }, 0)
})

const gradedCount = computed(() => {
  return Object.values(grades.value).filter(grade => grade && grade.trim() !== '').length
})

const totalPossibleGrades = computed(() => {
  return students.value.length * totalLearningFields.value
})

const progressPercentage = computed(() => {
  if (totalPossibleGrades.value === 0) return 0
  return Math.round((gradedCount.value / totalPossibleGrades.value) * 100)
})

// Methods
const getSubjectLearningFields = (subjectId: string) => {
  return learningFields.value.filter(field => field.mainSubjectId === subjectId)
}

const getSubjectFieldCount = (subjectId: string) => {
  return getSubjectLearningFields(subjectId).length
}

const loadStudents = () => {
  // In a real app, this would load students for the selected class
  console.log('Loading students for class:', selectedClass.value)
  
  // Auto-expand first subject when switching view mode
  if (filteredSubjects.value.length > 0) {
    expandedSubjects.value = [filteredSubjects.value[0].id]
  }
}

const toggleSubjectExpansion = (subjectId: string) => {
  const index = expandedSubjects.value.indexOf(subjectId)
  if (index > -1) {
    expandedSubjects.value.splice(index, 1)
  } else {
    expandedSubjects.value.push(subjectId)
  }
}

const markAsModified = (gradeKey: string) => {
  modifiedGrades.value.add(gradeKey)
}

const exportGrades = () => {
  // Implementation of exportGrades method
}

const saveGrades = async () => {
  const gradesToSave = Array.from(modifiedGrades.value).map(key => {
    const [studentId, fieldId] = key.split('-')
    return {
      studentId,
      fieldId,
      grade: grades.value[key],
      period: selectedPeriod.value,
      classId: selectedClass.value
    }
  })

  console.log('Saving grades:', gradesToSave)
  
  // Mock API call
  try {
    // await api.saveGrades(gradesToSave)
    modifiedGrades.value.clear()
    alert(language.value === 'de' ? 'Noten erfolgreich gespeichert!' : 'Grades saved successfully!')
  } catch (error) {
    alert(language.value === 'de' ? 'Fehler beim Speichern der Noten' : 'Error saving grades')
  }
}

// Watchers
watch(selectedClass, () => {
  if (selectedClass.value) {
    loadStudents()
  }
})

watch(viewMode, () => {
  // Reset expansion when switching view modes
  if (viewMode.value === 'field' && filteredSubjects.value.length > 0) {
    expandedSubjects.value = [filteredSubjects.value[0].id]
  } else {
    expandedSubjects.value = []
  }
})

// Initialize with first subject expanded if in field view
nextTick(() => {
  if (viewMode.value === 'field' && filteredSubjects.value.length > 0) {
    expandedSubjects.value = [filteredSubjects.value[0].id]
  }
})
</script> 