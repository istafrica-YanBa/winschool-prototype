<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-center">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <BookOpen class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Noten & Anwesenheit' : 'Grades & Attendance' }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Übersicht über die akademischen Leistungen Ihrer Kinder' : 'Overview of your children\'s academic performance' }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button class="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Download class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Bericht exportieren' : 'Export Report' }}
          </button>
        </div>
      </div>

      <!-- Child Selector -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center mb-4">
          <Users class="h-5 w-5 text-slate-600 dark:text-slate-400 mr-2" />
          <h2 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Kind auswählen' : 'Select Child' }}
          </h2>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="child in children"
            :key="child.id"
            @click="selectedChild = child"
            :class="[
              'flex items-center px-4 py-2 rounded-lg transition-colors',
              selectedChild?.id === child.id
                ? 'bg-winschool-primary text-slate-800'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
            ]"
          >
            <img :src="child.avatar" :alt="child.name" class="w-6 h-6 rounded-full mr-2" />
            {{ child.name }}
          </button>
        </div>
      </div>

      <!-- Academic Overview Cards -->
      <div v-if="selectedChild" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
                {{ language === 'de' ? 'Gesamtdurchschnitt' : 'Overall Average' }}
              </p>
              <p class="text-3xl font-bold text-green-600">{{ selectedChild.overallGrade }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
              <TrendingUp class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
                {{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}
              </p>
              <p class="text-3xl font-bold text-blue-600">{{ selectedChild.attendance }}%</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <Calendar class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
                {{ language === 'de' ? 'Abgeschlossene Aufgaben' : 'Completed Assignments' }}
              </p>
              <p class="text-3xl font-bold text-purple-600">{{ selectedChild.completedAssignments }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
              <FileText class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
                {{ language === 'de' ? 'Klassenpositio' : 'Class Rank' }}
              </p>
              <p class="text-3xl font-bold text-orange-600">#{{ selectedChild.classRank }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
              <Award class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div v-if="selectedChild" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Grade Trends Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {{ language === 'de' ? 'Notentrends' : 'Grade Trends' }}
            </h3>
            <select class="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <option>{{ language === 'de' ? 'Letzten 6 Monate' : 'Last 6 months' }}</option>
              <option>{{ language === 'de' ? 'Dieses Semester' : 'This semester' }}</option>
            </select>
          </div>
          
          <!-- Simple grade trend visualization -->
          <div class="space-y-4">
            <div v-for="subject in selectedChild.subjects" :key="subject.name" class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ subject.name }}</span>
                <span :class="getGradeColor(subject.currentGrade)" class="text-sm font-bold">
                  {{ subject.currentGrade }}
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  :class="getGradeBgColor(subject.currentGrade)" 
                  class="h-2 rounded-full transition-all duration-300" 
                  :style="{ width: getGradePercentage(subject.currentGrade) + '%' }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{{ language === 'de' ? 'Letzte Note:' : 'Previous:' }} {{ subject.previousGrade }}</span>
                <span v-if="subject.trend === 'up'" class="text-green-600 flex items-center">
                  <TrendingUp class="h-3 w-3 mr-1" />
                  {{ language === 'de' ? 'Verbesserung' : 'Improving' }}
                </span>
                <span v-else-if="subject.trend === 'down'" class="text-red-600 flex items-center">
                  <TrendingDown class="h-3 w-3 mr-1" />
                  {{ language === 'de' ? 'Rückgang' : 'Declining' }}
                </span>
                <span v-else class="text-gray-600 flex items-center">
                  <Minus class="h-3 w-3 mr-1" />
                  {{ language === 'de' ? 'Stabil' : 'Stable' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Attendance Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {{ language === 'de' ? 'Anwesenheitsmuster' : 'Attendance Pattern' }}
            </h3>
          </div>
          
          <!-- Attendance visualization -->
          <div class="space-y-4">
            <!-- Monthly attendance -->
            <div class="grid grid-cols-3 gap-4">
              <div v-for="month in attendanceData" :key="month.month" class="text-center">
                <div class="relative w-20 h-20 mx-auto mb-2">
                  <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16" cy="16" r="14"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                      class="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="16" cy="16" r="14"
                      stroke="currentColor"
                      stroke-width="4"
                      fill="none"
                      :stroke-dasharray="`${month.percentage * 0.88} 88`"
                      :class="getAttendanceColor(month.percentage)"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {{ month.percentage }}%
                    </span>
                  </div>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-400">{{ month.month }}</p>
              </div>
            </div>

            <!-- Weekly pattern -->
            <div class="mt-6">
              <h4 class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                {{ language === 'de' ? 'Wochenmuster' : 'Weekly Pattern' }}
              </h4>
              <div class="grid grid-cols-7 gap-1">
                <div v-for="day in weeklyPattern" :key="day.day" class="text-center">
                  <div :class="getAttendanceDayColor(day.rate)" class="w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium text-white mx-auto mb-1">
                    {{ day.rate }}%
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{{ day.day }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Grades -->
      <div v-if="selectedChild" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Letzte Noten' : 'Recent Grades' }}
          </h3>
          <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            {{ language === 'de' ? 'Alle anzeigen' : 'View all' }}
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  {{ language === 'de' ? 'Fach' : 'Subject' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  {{ language === 'de' ? 'Aufgabe' : 'Assignment' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  {{ language === 'de' ? 'Note' : 'Grade' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  {{ language === 'de' ? 'Datum' : 'Date' }}
                </th>
                <th class="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                  {{ language === 'de' ? 'Kommentar' : 'Comment' }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="grade in recentGrades" :key="grade.id" class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="py-3 px-4 text-slate-800 dark:text-slate-200">{{ grade.subject }}</td>
                <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ grade.assignment }}</td>
                <td class="py-3 px-4">
                  <span :class="getGradeColor(grade.grade)" class="font-semibold">
                    {{ grade.grade }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ grade.date }}</td>
                <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ grade.comment }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Learning Goals Progress -->
      <div v-if="selectedChild" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {{ language === 'de' ? 'Lernziele Fortschritt' : 'Learning Goals Progress' }}
          </h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="goal in learningGoals" :key="goal.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-slate-800 dark:text-slate-200">{{ goal.title }}</h4>
              <span :class="getGoalStatusColor(goal.status)" class="text-xs px-2 py-1 rounded-full">
                {{ goal.status }}
              </span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">{{ goal.description }}</p>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                :class="getGoalProgressColor(goal.progress)"
                class="h-2 rounded-full transition-all duration-300" 
                :style="{ width: goal.progress + '%' }"
              ></div>
            </div>
            <div class="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{{ goal.progress }}% {{ language === 'de' ? 'abgeschlossen' : 'complete' }}</span>
              <span>{{ language === 'de' ? 'Fällig:' : 'Due:' }} {{ goal.dueDate }}</span>
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
import { BookOpen, Users, Calendar, FileText, Award, TrendingUp, TrendingDown, Minus, Download } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Sample data for children
const children = ref([
  {
    id: 1,
    name: 'Emma Müller',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    overallGrade: 'A-',
    attendance: 95,
    completedAssignments: 24,
    classRank: 3,
    subjects: [
      { name: 'Mathematics', currentGrade: 'A', previousGrade: 'B+', trend: 'up' },
      { name: 'Science', currentGrade: 'A-', previousGrade: 'A-', trend: 'stable' },
      { name: 'English', currentGrade: 'B+', previousGrade: 'A-', trend: 'down' },
      { name: 'History', currentGrade: 'A', previousGrade: 'B', trend: 'up' },
      { name: 'Art', currentGrade: 'A+', previousGrade: 'A', trend: 'up' }
    ]
  },
  {
    id: 2,
    name: 'Liam Weber',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    overallGrade: 'B+',
    attendance: 92,
    completedAssignments: 22,
    classRank: 7,
    subjects: [
      { name: 'Mathematics', currentGrade: 'B', previousGrade: 'B-', trend: 'up' },
      { name: 'Science', currentGrade: 'B+', previousGrade: 'B+', trend: 'stable' },
      { name: 'English', currentGrade: 'A-', previousGrade: 'B+', trend: 'up' },
      { name: 'History', currentGrade: 'B', previousGrade: 'B+', trend: 'down' },
      { name: 'Physical Education', currentGrade: 'A', previousGrade: 'A-', trend: 'up' }
    ]
  }
])

const selectedChild = ref(children.value[0])

// Sample attendance data
const attendanceData = ref([
  { month: 'Oct', percentage: 98 },
  { month: 'Nov', percentage: 94 },
  { month: 'Dec', percentage: 92 }
])

const weeklyPattern = ref([
  { day: 'M', rate: 98 },
  { day: 'T', rate: 96 },
  { day: 'W', rate: 94 },
  { day: 'T', rate: 97 },
  { day: 'F', rate: 89 },
  { day: 'S', rate: 0 },
  { day: 'S', rate: 0 }
])

// Sample recent grades
const recentGrades = ref([
  {
    id: 1,
    subject: 'Mathematics',
    assignment: 'Algebra Test',
    grade: 'A',
    date: '2024-01-15',
    comment: 'Excellent work on complex equations'
  },
  {
    id: 2,
    subject: 'Science',
    assignment: 'Chemistry Lab Report',
    grade: 'A-',
    date: '2024-01-12',
    comment: 'Good analysis, needs better conclusion'
  },
  {
    id: 3,
    subject: 'English',
    assignment: 'Essay Assignment',
    grade: 'B+',
    date: '2024-01-10',
    comment: 'Creative ideas, work on structure'
  }
])

// Sample learning goals
const learningGoals = ref([
  {
    id: 1,
    title: 'Improve Writing Skills',
    description: 'Focus on essay structure and grammar',
    progress: 75,
    status: 'In Progress',
    dueDate: '2024-02-28'
  },
  {
    id: 2,
    title: 'Master Quadratic Equations',
    description: 'Complete all algebra exercises',
    progress: 90,
    status: 'Nearly Complete',
    dueDate: '2024-01-31'
  },
  {
    id: 3,
    title: 'Science Fair Project',
    description: 'Research and present chemistry experiment',
    progress: 45,
    status: 'In Progress',
    dueDate: '2024-03-15'
  }
])

// Helper functions for styling
const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-600'
  if (grade.startsWith('B')) return 'text-blue-600'
  if (grade.startsWith('C')) return 'text-yellow-600'
  return 'text-red-600'
}

const getGradeBgColor = (grade: string) => {
  if (grade.startsWith('A')) return 'bg-green-500'
  if (grade.startsWith('B')) return 'bg-blue-500'
  if (grade.startsWith('C')) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getGradePercentage = (grade: string) => {
  const gradeMap: { [key: string]: number } = {
    'A+': 97, 'A': 93, 'A-': 90,
    'B+': 87, 'B': 83, 'B-': 80,
    'C+': 77, 'C': 73, 'C-': 70,
    'D+': 67, 'D': 63, 'D-': 60,
    'F': 50
  }
  return gradeMap[grade] || 50
}

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 95) return 'text-green-500'
  if (percentage >= 90) return 'text-blue-500'
  if (percentage >= 85) return 'text-yellow-500'
  return 'text-red-500'
}

const getAttendanceDayColor = (rate: number) => {
  if (rate === 0) return 'bg-gray-300'
  if (rate >= 95) return 'bg-green-500'
  if (rate >= 90) return 'bg-blue-500'
  if (rate >= 85) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getGoalStatusColor = (status: string) => {
  if (status === 'Complete') return 'bg-green-100 text-green-800'
  if (status === 'Nearly Complete') return 'bg-blue-100 text-blue-800'
  if (status === 'In Progress') return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}

const getGoalProgressColor = (progress: number) => {
  if (progress >= 90) return 'bg-green-500'
  if (progress >= 70) return 'bg-blue-500'
  if (progress >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}
</script> 