<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Today's Classes -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Calendar class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Heutige Klassen' : 'Today\'s Classes' }}
      </h2>
      <div class="space-y-3">
        <div 
          v-for="class_ in todayClasses" 
          :key="class_.id"
          class="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
        >
          <div class="flex-shrink-0 w-16 text-center">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ class_.time }}</p>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ class_.subject }} - {{ class_.class }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ class_.room }} • {{ class_.students }} students</p>
          </div>
          <div class="flex-shrink-0 flex space-x-2">
            <button class="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
              {{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}
            </button>
            <button class="px-3 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors">
              {{ language === 'de' ? 'Noten' : 'Grades' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="space-y-6">
      <!-- Grading Queue -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
          <BookOpen class="h-5 w-5 mr-2 text-blue-600" />
          {{ language === 'de' ? 'Bewertungsqueue' : 'Grading Queue' }}
        </h3>
        <div class="space-y-3">
          <div v-for="assignment in gradingQueue" :key="assignment.id" class="flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ assignment.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ assignment.class }}</p>
            </div>
            <span class="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 px-2 py-1 text-xs font-medium rounded-full">
              {{ assignment.pending }}
            </span>
          </div>
        </div>
        <button class="w-full bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium py-2 rounded-lg transition-colors text-sm mt-4">
          {{ language === 'de' ? 'Bewertung starten' : 'Start Grading' }}
        </button>
      </div>

      <!-- Student Alerts -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
          <AlertTriangle class="h-5 w-5 mr-2 text-yellow-500" />
          {{ language === 'de' ? 'Schüler-Warnungen' : 'Student Alerts' }}
        </h3>
        <div class="space-y-3">
          <div v-for="alert in studentAlerts" :key="alert.id" class="border-l-4 border-yellow-500 pl-3">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ alert.student }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ alert.issue }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Class Performance Analytics -->
    <div class="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <BarChart3 class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Klassenleistung' : 'Class Performance' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="classData in classPerformance" :key="classData.class" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h3 class="font-medium text-slate-800 dark:text-slate-50 mb-3">{{ classData.class }}</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Durchschnitt' : 'Average' }}</span>
              <span :class="getGradeColor(classData.average)" class="font-semibold">{{ classData.average }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</span>
              <span class="font-semibold text-green-500">{{ classData.attendance }}%</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Aufgaben eingereicht' : 'Assignments Submitted' }}</span>
              <span class="font-semibold text-blue-600">{{ classData.submissions }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Calendar, BookOpen, AlertTriangle, BarChart3 } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const todayClasses = [
  { id: 1, time: '08:00', subject: 'Mathematics', class: '10A', room: 'Room 101', students: 28 },
  { id: 2, time: '09:00', subject: 'Mathematics', class: '10B', room: 'Room 101', students: 25 },
  { id: 3, time: '11:00', subject: 'Advanced Calculus', class: '12A', room: 'Room 205', students: 18 },
  { id: 4, time: '13:00', subject: 'Mathematics', class: '9C', room: 'Room 101', students: 30 },
  { id: 5, time: '14:00', subject: 'Math Tutoring', class: 'Mixed', room: 'Room 101', students: 12 }
]

const gradingQueue = [
  { id: 1, title: 'Algebra Test', class: '10A', pending: 28 },
  { id: 2, title: 'Calculus Quiz', class: '12A', pending: 18 },
  { id: 3, title: 'Geometry Homework', class: '9C', pending: 15 }
]

const studentAlerts = [
  { id: 1, student: 'Max Weber', issue: '3 consecutive absences' },
  { id: 2, student: 'Lisa Schmidt', issue: 'Declining performance trend' },
  { id: 3, student: 'Tom Fischer', issue: 'Missing assignments' }
]

const classPerformance = [
  { class: 'Class 10A', average: 'B+', attendance: 94, submissions: 89 },
  { class: 'Class 10B', average: 'A-', attendance: 96, submissions: 92 },
  { class: 'Class 12A', average: 'A', attendance: 98, submissions: 95 }
]

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-500 dark:text-green-400'
  if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400'
  if (grade.startsWith('C')) return 'text-yellow-500 dark:text-yellow-400'
  return 'text-red-500 dark:text-red-400'
}
</script>