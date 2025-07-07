<template>
  <div class="attendance-view bg-gray-50 dark:bg-gray-900 min-h-screen p-3 sm:p-6">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Calendar class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ isParent ? (language === 'de' ? 'Anwesenheit & Verhalten' : 'Attendance & Behavior') : (language === 'de' ? 'Meine Anwesenheit' : 'My Attendance') }}
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ isParent ? (language === 'de' ? 'Anwesenheit und Verhalten Ihres Kindes verfolgen' : 'Track your child\'s attendance and behavior') : (language === 'de' ? 'Verfolgen Sie Ihre Anwesenheit in allen Kursen' : 'Track your attendance across all courses') }}
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button @click="exportReport" class="w-full sm:w-auto bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium px-4 py-3 sm:py-2 rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base">
            <Download class="h-4 w-4 mr-2" />
            {{ language === 'de' ? 'Bericht exportieren' : 'Export Report' }}
          </button>
        </div>
      </div>

      <!-- Student Selection for Parents -->
      <div v-if="isParent" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {{ language === 'de' ? 'Kind auswählen' : 'Select Child' }}
        </h3>
        <div class="flex flex-wrap gap-4">
          <button 
            v-for="child in children" 
            :key="child.id"
            @click="selectChild(child)"
            :class="[
              'flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200',
              selectedChild?.id === child.id 
                ? 'border-winschool-primary bg-winschool-primary/10 text-winschool-primary ring-2 ring-winschool-primary/20' 
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            <img :src="child.avatar" :alt="child.name" class="h-10 w-10 rounded-full object-cover" />
            <div class="text-left">
              <p class="font-medium text-gray-900 dark:text-white">{{ child.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ child.class }}</p>
            </div>
            <CheckCircle v-if="selectedChild?.id === child.id" class="h-5 w-5 text-winschool-primary ml-auto" />
          </button>
        </div>
        
        <!-- Selected Child Indicator -->
        <div v-if="selectedChild" class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div class="flex items-center space-x-2">
            <Users class="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
              {{ language === 'de' ? 'Zeige Daten für:' : 'Showing data for:' }} 
              <span class="font-bold">{{ selectedChild.name }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Overall Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Loading State -->
        <template v-if="isLoadingChildData">
          <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 w-12 h-12"></div>
              <div class="ml-4 flex-1">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </template>
        
        <!-- Actual Statistics -->
        <template v-else-if="overallStats">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                <CheckCircle class="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'Anwesenheitsrate' : 'Attendance Rate' }}
                </p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ overallStats.attendanceRate }}%</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Clock class="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'Verspätungen' : 'Late Arrivals' }}
                </p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ overallStats.lateArrivals }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-red-100 dark:bg-red-900">
                <X class="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'Fehlzeiten' : 'Absences' }}
                </p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ overallStats.absences }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
            <div class="flex items-center">
              <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <Star class="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ language === 'de' ? 'Verhaltensnote' : 'Behavior Score' }}
                </p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ overallStats.behaviorScore }}/10</p>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Attendance Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ language === 'de' ? 'Anwesenheitstrend' : 'Attendance Trend' }}
          </h3>
          <select v-model="chartPeriod" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="week">{{ language === 'de' ? 'Diese Woche' : 'This Week' }}</option>
            <option value="month">{{ language === 'de' ? 'Dieser Monat' : 'This Month' }}</option>
            <option value="semester">{{ language === 'de' ? 'Dieses Semester' : 'This Semester' }}</option>
          </select>
        </div>
        
        <!-- Loading State for Chart -->
        <div v-if="isLoadingChildData" class="space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center space-x-4 animate-pulse">
            <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4"></div>
            <div class="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        
        <!-- Simple Chart Representation -->
        <div v-else class="space-y-4">
          <div v-for="(day, index) in weeklyAttendance" :key="index" class="flex items-center space-x-4">
            <div class="w-16 text-sm text-gray-600 dark:text-gray-400">{{ day.day }}</div>
            <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                :class="getAttendanceColor(day.rate)" 
                class="h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2" 
                :style="{ width: day.rate + '%' }"
              >
                <span class="text-xs font-medium text-white">{{ day.rate }}%</span>
              </div>
            </div>
            <div class="w-16 text-sm text-gray-900 dark:text-white text-right">{{ day.present }}/{{ day.total }}</div>
          </div>
        </div>
      </div>

      <!-- Course-by-Course Breakdown -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ language === 'de' ? 'Kursspezifische Anwesenheit' : 'Course-by-Course Attendance' }}
            </h3>
            <div class="flex space-x-3">
              <select v-model="selectedSemester" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="current">{{ language === 'de' ? 'Aktuelles Semester' : 'Current Semester' }}</option>
                <option value="previous">{{ language === 'de' ? 'Vorheriges Semester' : 'Previous Semester' }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Course List -->
        <div class="p-6 space-y-4">
          <!-- Loading State for Courses -->
          <template v-if="isLoadingChildData">
            <div v-for="i in 3" :key="i" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 animate-pulse">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 w-9 h-9"></div>
                  <div>
                    <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-1"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3"></div>
              <div class="flex items-center justify-between">
                <div class="flex space-x-4">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          </template>

          <!-- Actual Courses -->
          <div v-else v-for="course in courseAttendance" :key="course.id" class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div :class="getCourseIconColor(course.subject)" class="p-2 rounded-lg">
                  <BookOpen class="h-5 w-5" />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ course.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ course.teacher }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ course.attendanceRate }}%</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ course.present }}/{{ course.total }} {{ language === 'de' ? 'Klassen' : 'classes' }}</p>
              </div>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
              <div 
                :class="getAttendanceColor(course.attendanceRate)" 
                class="h-2 rounded-full transition-all duration-500" 
                :style="{ width: course.attendanceRate + '%' }"
              ></div>
            </div>

            <!-- Behavior and Recent Activity -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-1">
                  <Star class="h-4 w-4 text-yellow-500" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ language === 'de' ? 'Verhalten:' : 'Behavior:' }} {{ course.behaviorScore }}/10
                  </span>
                </div>
                <div class="flex items-center space-x-1">
                  <Clock class="h-4 w-4 text-blue-500" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ course.lateCount }} {{ language === 'de' ? 'Verspätungen' : 'late' }}
                  </span>
                </div>
              </div>
              <button 
                @click="showCourseDetails(course)"
                class="text-sm text-winschool-primary hover:text-winschool-primary-dark transition-colors font-medium"
              >
                {{ language === 'de' ? 'Details anzeigen' : 'View Details' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Attendance Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {{ language === 'de' ? 'Aktuelle Aktivität' : 'Recent Activity' }}
        </h3>
        
        <!-- Loading State for Recent Activity -->
        <div v-if="isLoadingChildData" class="space-y-4">
          <div v-for="i in 3" :key="i" class="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 animate-pulse">
            <div class="p-2 rounded-full bg-gray-200 dark:bg-gray-600 w-8 h-8"></div>
            <div class="flex-1">
              <div class="h-5 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-1"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
            <div class="text-right">
              <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-1"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
            </div>
          </div>
        </div>
        
        <!-- Actual Recent Activity -->
        <div v-else class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            <div :class="getActivityIconColor(activity.type)" class="p-2 rounded-full">
              <component :is="getActivityIcon(activity.type)" class="h-4 w-4" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-white">{{ activity.course }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(activity.date) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Details Modal -->
    <div v-if="selectedCourse" class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ selectedCourse.name }} - {{ language === 'de' ? 'Anwesenheitsdetails' : 'Attendance Details' }}
            </h3>
            <button @click="selectedCourse = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <!-- Course Summary -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Anwesenheitsrate' : 'Attendance Rate' }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedCourse.attendanceRate }}%</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Anwesende Klassen' : 'Classes Attended' }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedCourse.present }}/{{ selectedCourse.total }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ language === 'de' ? 'Verhaltensnote' : 'Behavior Score' }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedCourse.behaviorScore }}/10</p>
            </div>
          </div>

          <!-- Detailed Attendance History -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ language === 'de' ? 'Datum' : 'Date' }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ language === 'de' ? 'Status' : 'Status' }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ language === 'de' ? 'Uhrzeit' : 'Time' }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ language === 'de' ? 'Verhalten' : 'Behavior' }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ language === 'de' ? 'Kommentare' : 'Comments' }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="record in selectedCourse.attendanceHistory" :key="record.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDate(record.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusBadgeClass(record.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getStatusText(record.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ record.time || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <Star v-for="i in 5" :key="i" :class="i <= record.behaviorRating ? 'text-yellow-400' : 'text-gray-300'" class="h-4 w-4" />
                      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ record.behaviorRating }}/5</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {{ record.comments || '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useAuthStore } from '../stores/auth'
import { Calendar, CheckCircle, Clock, X, Star, BookOpen, Download, Users } from 'lucide-vue-next'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const language = computed(() => themeStore.language)

// Check if current user is a parent
const isParent = computed(() => authStore.user?.role === 'parent')

// Selected period and filters
const chartPeriod = ref('week')
const selectedSemester = ref('current')
const selectedChild = ref<any>(null)
const selectedCourse = ref<any>(null)
const isLoadingChildData = ref(false)

// Mock data for children (for parents)
const children = ref([
  {
    id: 1,
    name: 'Emma Müller',
    class: 'Class 10A',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  },
  {
    id: 2,
    name: 'Max Müller',
    class: 'Class 7B',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  }
])

// Child-specific data storage
const childDataMap = ref(new Map([
  [1, { // Emma Müller - Class 10A (Better student)
    overallStats: {
      attendanceRate: 94,
      lateArrivals: 3,
      absences: 5,
      behaviorScore: 8.5
    },
    weeklyAttendance: [
      { day: language.value === 'de' ? 'Mo' : 'Mon', rate: 100, present: 6, total: 6 },
      { day: language.value === 'de' ? 'Di' : 'Tue', rate: 83, present: 5, total: 6 },
      { day: language.value === 'de' ? 'Mi' : 'Wed', rate: 100, present: 6, total: 6 },
      { day: language.value === 'de' ? 'Do' : 'Thu', rate: 100, present: 6, total: 6 },
      { day: language.value === 'de' ? 'Fr' : 'Fri', rate: 67, present: 4, total: 6 }
    ],
    courseAttendance: [
      {
        id: 1,
        name: 'Advanced Mathematics',
        teacher: 'Dr. Weber',
        subject: 'math',
        attendanceRate: 96,
        present: 24,
        total: 25,
        behaviorScore: 9,
        lateCount: 1,
        attendanceHistory: [
          { id: 1, date: '2024-01-15', status: 'present', time: '08:00', behaviorRating: 5, comments: 'Excellent participation' },
          { id: 2, date: '2024-01-16', status: 'late', time: '08:10', behaviorRating: 4, comments: 'Arrived 10 minutes late' },
          { id: 3, date: '2024-01-17', status: 'present', time: '08:00', behaviorRating: 5, comments: '' },
          { id: 4, date: '2024-01-18', status: 'present', time: '08:00', behaviorRating: 5, comments: 'Great homework submission' },
          { id: 5, date: '2024-01-19', status: 'absent', time: '', behaviorRating: 0, comments: 'Sick leave' }
        ]
      },
      {
        id: 2,
        name: 'English Literature',
        teacher: 'Ms. Johnson',
        subject: 'english',
        attendanceRate: 92,
        present: 23,
        total: 25,
        behaviorScore: 8,
        lateCount: 2,
        attendanceHistory: [
          { id: 1, date: '2024-01-15', status: 'present', time: '09:00', behaviorRating: 4, comments: 'Good discussion participation' },
          { id: 2, date: '2024-01-16', status: 'present', time: '09:00', behaviorRating: 5, comments: 'Excellent essay presentation' },
          { id: 3, date: '2024-01-17', status: 'late', time: '09:15', behaviorRating: 3, comments: 'Late due to transport issues' },
          { id: 4, date: '2024-01-18', status: 'absent', time: '', behaviorRating: 0, comments: 'Family emergency' },
          { id: 5, date: '2024-01-19', status: 'present', time: '09:00', behaviorRating: 5, comments: 'Caught up on missed work' }
        ]
      },
      {
        id: 3,
        name: 'Chemistry',
        teacher: 'Prof. Schmidt',
        subject: 'science',
        attendanceRate: 88,
        present: 22,
        total: 25,
        behaviorScore: 7,
        lateCount: 0,
        attendanceHistory: [
          { id: 1, date: '2024-01-15', status: 'present', time: '10:00', behaviorRating: 4, comments: 'Active in lab work' },
          { id: 2, date: '2024-01-16', status: 'absent', time: '', behaviorRating: 0, comments: 'Dentist appointment' },
          { id: 3, date: '2024-01-17', status: 'present', time: '10:00', behaviorRating: 5, comments: 'Excellent lab report' },
          { id: 4, date: '2024-01-18', status: 'present', time: '10:00', behaviorRating: 4, comments: 'Good teamwork' },
          { id: 5, date: '2024-01-19', status: 'absent', time: '', behaviorRating: 0, comments: 'School trip conflict' }
        ]
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'present',
        course: 'Advanced Mathematics',
        description: language.value === 'de' ? 'Pünktlich anwesend' : 'Present on time',
        date: '2024-01-19',
        time: '08:00'
      },
      {
        id: 2,
        type: 'late',
        course: 'English Literature',
        description: language.value === 'de' ? '15 Minuten zu spät' : '15 minutes late',
        date: '2024-01-18',
        time: '09:15'
      },
      {
        id: 3,
        type: 'absent',
        course: 'Chemistry',
        description: language.value === 'de' ? 'Entschuldigt abwesend' : 'Excused absence',
        date: '2024-01-17',
        time: '-'
      }
    ]
  }],
  [2, { // Max Müller - Class 7B (More issues)
    overallStats: {
      attendanceRate: 87,
      lateArrivals: 8,
      absences: 9,
      behaviorScore: 6.5
    },
    weeklyAttendance: [
      { day: language.value === 'de' ? 'Mo' : 'Mon', rate: 83, present: 5, total: 6 },
      { day: language.value === 'de' ? 'Di' : 'Tue', rate: 67, present: 4, total: 6 },
      { day: language.value === 'de' ? 'Mi' : 'Wed', rate: 100, present: 6, total: 6 },
      { day: language.value === 'de' ? 'Do' : 'Thu', rate: 83, present: 5, total: 6 },
      { day: language.value === 'de' ? 'Fr' : 'Fri', rate: 100, present: 6, total: 6 }
    ],
    courseAttendance: [
      {
        id: 1,
        name: 'Mathematics',
        teacher: 'Mr. Brown',
        subject: 'math',
        attendanceRate: 84,
        present: 21,
        total: 25,
        behaviorScore: 6,
        lateCount: 4,
        attendanceHistory: [
          { id: 1, date: '2024-01-15', status: 'late', time: '08:15', behaviorRating: 3, comments: 'Disruptive behavior' },
          { id: 2, date: '2024-01-16', status: 'absent', time: '', behaviorRating: 0, comments: 'Unexcused absence' },
          { id: 3, date: '2024-01-17', status: 'present', time: '08:00', behaviorRating: 4, comments: 'Better focus today' },
          { id: 4, date: '2024-01-18', status: 'late', time: '08:20', behaviorRating: 2, comments: 'Very late, missed quiz start' },
          { id: 5, date: '2024-01-19', status: 'present', time: '08:00', behaviorRating: 4, comments: 'Good improvement' }
        ]
      },
      {
        id: 2,
        name: 'Science',
        teacher: 'Dr. Green',
        subject: 'science',
        attendanceRate: 88,
        present: 22,
        total: 25,
        behaviorScore: 7,
        lateCount: 3,
        attendanceHistory: [
          { id: 1, date: '2024-01-15', status: 'present', time: '09:00', behaviorRating: 4, comments: 'Engaged in experiments' },
          { id: 2, date: '2024-01-16', status: 'late', time: '09:10', behaviorRating: 3, comments: 'Late but participated well' },
          { id: 3, date: '2024-01-17', status: 'absent', time: '', behaviorRating: 0, comments: 'Doctor appointment' },
          { id: 4, date: '2024-01-18', status: 'present', time: '09:00', behaviorRating: 5, comments: 'Excellent lab work' },
          { id: 5, date: '2024-01-19', status: 'present', time: '09:00', behaviorRating: 4, comments: 'Good teamwork' }
        ]
      },
      {
        id: 3,
        name: 'History',
        teacher: 'Ms. Davis',
        subject: 'history',
        attendanceRate: 90,
        present: 18,
        total: 20,
        behaviorScore: 7,
        lateCount: 1,
        attendanceHistory: [
          { id: 1, date: '2024-01-15', status: 'present', time: '10:00', behaviorRating: 4, comments: 'Good questions about WWI' },
          { id: 2, date: '2024-01-16', status: 'present', time: '10:00', behaviorRating: 5, comments: 'Excellent project presentation' },
          { id: 3, date: '2024-01-17', status: 'present', time: '10:00', behaviorRating: 4, comments: 'Active participation' },
          { id: 4, date: '2024-01-18', status: 'absent', time: '', behaviorRating: 0, comments: 'Sick' },
          { id: 5, date: '2024-01-19', status: 'late', time: '10:05', behaviorRating: 3, comments: 'Slightly late but caught up' }
        ]
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'late',
        course: 'Mathematics',
        description: language.value === 'de' ? '20 Minuten zu spät' : '20 minutes late',
        date: '2024-01-19',
        time: '08:20'
      },
      {
        id: 2,
        type: 'absent',
        course: 'Science',
        description: language.value === 'de' ? 'Unentschuldigt abwesend' : 'Unexcused absence',
        date: '2024-01-18',
        time: '-'
      },
      {
        id: 3,
        type: 'present',
        course: 'History',
        description: language.value === 'de' ? 'Gute Teilnahme' : 'Good participation',
        date: '2024-01-17',
        time: '10:00'
      }
    ]
  }]
]))

// Reactive data based on selected child
const overallStats = computed(() => {
  if (!isParent.value) {
    return {
      attendanceRate: 94,
      lateArrivals: 3,
      absences: 5,
      behaviorScore: 8.5
    }
  }
  return selectedChild.value ? childDataMap.value.get(selectedChild.value.id)?.overallStats : null
})

const weeklyAttendance = computed(() => {
  if (!isParent.value) {
    return [
      { day: language.value === 'de' ? 'Mo' : 'Mon', rate: 100, present: 6, total: 6 },
      { day: language.value === 'de' ? 'Di' : 'Tue', rate: 83, present: 5, total: 6 },
      { day: language.value === 'de' ? 'Mi' : 'Wed', rate: 100, present: 6, total: 6 },
      { day: language.value === 'de' ? 'Do' : 'Thu', rate: 100, present: 6, total: 6 },
      { day: language.value === 'de' ? 'Fr' : 'Fri', rate: 67, present: 4, total: 6 }
    ]
  }
  return selectedChild.value ? childDataMap.value.get(selectedChild.value.id)?.weeklyAttendance : []
})

const courseAttendance = computed(() => {
  if (!isParent.value) {
    return [
      {
        id: 1,
        name: 'Mathematics',
        teacher: 'Dr. Weber',
        subject: 'math',
        attendanceRate: 96,
        present: 24,
        total: 25,
        behaviorScore: 9,
        lateCount: 1,
        attendanceHistory: [
          { id: 1, date: '2024-01-15', status: 'present', time: '08:00', behaviorRating: 5, comments: 'Excellent participation' },
          { id: 2, date: '2024-01-16', status: 'late', time: '08:10', behaviorRating: 4, comments: 'Arrived 10 minutes late' },
          { id: 3, date: '2024-01-17', status: 'present', time: '08:00', behaviorRating: 5, comments: '' },
          { id: 4, date: '2024-01-18', status: 'present', time: '08:00', behaviorRating: 5, comments: 'Great homework submission' },
          { id: 5, date: '2024-01-19', status: 'absent', time: '', behaviorRating: 0, comments: 'Sick leave' }
        ]
      }
    ]
  }
  return selectedChild.value ? childDataMap.value.get(selectedChild.value.id)?.courseAttendance : []
})

const recentActivity = computed(() => {
  if (!isParent.value) {
    return [
      {
        id: 1,
        type: 'present',
        course: 'Mathematics',
        description: language.value === 'de' ? 'Pünktlich anwesend' : 'Present on time',
        date: '2024-01-19',
        time: '08:00'
      }
    ]
  }
  return selectedChild.value ? childDataMap.value.get(selectedChild.value.id)?.recentActivity : []
})

// Methods
const selectChild = async (child: any) => {
  if (selectedChild.value?.id === child.id) return
  
  isLoadingChildData.value = true
  selectedChild.value = child
  
  // Simulate loading delay for better UX
  await new Promise(resolve => setTimeout(resolve, 300))
  isLoadingChildData.value = false
}

const getAttendanceColor = (rate: number) => {
  if (rate >= 95) return 'bg-green-500'
  if (rate >= 85) return 'bg-blue-500'
  if (rate >= 75) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getCourseIconColor = (subject: string) => {
  const colors = {
    math: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    english: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
    science: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    history: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300'
  }
  return colors[subject as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
}

const getActivityIconColor = (type: string) => {
  switch (type) {
    case 'present':
      return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
    case 'late':
      return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
    case 'absent':
      return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'present':
      return CheckCircle
    case 'late':
      return Clock
    case 'absent':
      return X
    default:
      return Calendar
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'present':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'late':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'absent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusText = (status: string) => {
  const statusTexts = {
    present: language.value === 'de' ? 'Anwesend' : 'Present',
    late: language.value === 'de' ? 'Verspätet' : 'Late',
    absent: language.value === 'de' ? 'Abwesend' : 'Absent'
  }
  return statusTexts[status as keyof typeof statusTexts] || status
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US')
}

const showCourseDetails = (course: any) => {
  selectedCourse.value = course
}

const exportReport = () => {
  // Implementation for exporting attendance report
  alert(language.value === 'de' ? 'Anwesenheitsbericht wird exportiert...' : 'Exporting attendance report...')
}

// Initialize data
onMounted(() => {
  if (isParent.value && children.value.length > 0) {
    selectedChild.value = children.value[0]
  }
})
</script>

<style scoped>
/* Custom styles for better chart appearance */
.attendance-chart {
  min-height: 200px;
}
</style> 