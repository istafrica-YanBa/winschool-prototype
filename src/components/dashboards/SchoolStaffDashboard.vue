<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Student Records Overview -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Users class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Schülerakten Übersicht' : 'Student Records Overview' }}
      </h2>
      <div class="space-y-3">
        <div 
          v-for="record in studentRecords" 
          :key="record.id"
          class="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
        >
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <span class="text-white font-semibold text-sm">{{ record.initials }}</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ record.name }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ record.class }} • {{ record.studentId }}</p>
          </div>
          <div class="flex-shrink-0 flex space-x-2">
            <span :class="getStatusColor(record.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ record.status }}
            </span>
            <button class="px-3 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
              {{ language === 'de' ? 'Details' : 'Details' }}
            </button>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <button class="w-full bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium py-2 rounded-lg transition-colors text-sm">
          {{ language === 'de' ? 'Alle Schüler anzeigen' : 'View All Students' }}
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="space-y-6">
      <!-- Attendance Summary -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
          <Calendar class="h-5 w-5 mr-2 text-green-600" />
          {{ language === 'de' ? 'Anwesenheit heute' : 'Today\'s Attendance' }}
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Anwesend' : 'Present' }}</span>
            <span class="font-semibold text-green-600">{{ attendanceSummary.present }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Abwesend' : 'Absent' }}</span>
            <span class="font-semibold text-red-600">{{ attendanceSummary.absent }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600 dark:text-slate-400">{{ language === 'de' ? 'Verspätet' : 'Late' }}</span>
            <span class="font-semibold text-yellow-600">{{ attendanceSummary.late }}</span>
          </div>
          <div class="pt-2 border-t border-slate-200 dark:border-slate-600">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-800 dark:text-slate-200">{{ language === 'de' ? 'Gesamt' : 'Total' }}</span>
              <span class="font-bold text-slate-800 dark:text-slate-200">{{ attendanceSummary.total }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Library Management -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
          <BookOpen class="h-5 w-5 mr-2 text-purple-600" />
          {{ language === 'de' ? 'Bibliothek' : 'Library' }}
        </h3>
        <div class="space-y-3">
          <div v-for="item in libraryItems" :key="item.id" class="flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ item.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.type }}</p>
            </div>
            <span :class="getLibraryStatusColor(item.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ item.status }}
            </span>
          </div>
        </div>
        <button class="w-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-800 dark:text-purple-400 font-medium py-2 rounded-lg transition-colors text-sm mt-4">
          {{ language === 'de' ? 'Bibliothek verwalten' : 'Manage Library' }}
        </button>
      </div>

      <!-- Administrative Tasks -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
          <ClipboardList class="h-5 w-5 mr-2 text-orange-600" />
          {{ language === 'de' ? 'Verwaltungsaufgaben' : 'Administrative Tasks' }}
        </h3>
        <div class="space-y-3">
          <div v-for="task in adminTasks" :key="task.id" class="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div class="flex items-center">
              <component :is="task.icon" class="h-4 w-4 mr-2 text-slate-500" />
              <span class="text-sm text-slate-800 dark:text-slate-50">{{ task.title }}</span>
            </div>
            <span :class="getTaskPriorityColor(task.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ task.priority }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Activity class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Letzte Aktivitäten' : 'Recent Activities' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="activity in recentActivities" :key="activity.id" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex items-start">
            <div :class="activity.iconBg" class="p-2 rounded-lg mr-3">
              <component :is="activity.icon" class="h-4 w-4 text-white" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ activity.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ activity.description }}</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Zap class="h-5 w-5 mr-2 text-yellow-600" />
        {{ language === 'de' ? 'Schnellaktionen' : 'Quick Actions' }}
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <button 
          v-for="action in quickActions" 
          :key="action.id"
          class="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
        >
          <div :class="action.iconBg" class="p-3 rounded-lg mb-2">
            <component :is="action.icon" class="h-5 w-5 text-white" />
          </div>
          <span class="text-xs font-medium text-slate-800 dark:text-slate-50 text-center">{{ action.title }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { 
  Users, Calendar, BookOpen, ClipboardList, Activity, Zap,
  UserPlus, FileText, DollarSign, MessageSquare, Settings
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

// Mock data for student records
const studentRecords = [
  {
    id: 1,
    name: 'Anna Schmidt',
    class: 'Class 10A',
    studentId: 'STU-2024-001',
    status: 'Active',
    initials: 'AS'
  },
  {
    id: 2,
    name: 'Max Weber',
    class: 'Class 11B',
    studentId: 'STU-2024-002',
    status: 'Active',
    initials: 'MW'
  },
  {
    id: 3,
    name: 'Lisa Müller',
    class: 'Class 9C',
    studentId: 'STU-2024-003',
    status: 'Pending',
    initials: 'LM'
  },
  {
    id: 4,
    name: 'Tom Fischer',
    class: 'Class 12A',
    studentId: 'STU-2024-004',
    status: 'Active',
    initials: 'TF'
  }
]

// Mock data for attendance summary
const attendanceSummary = {
  present: 1247,
  absent: 23,
  late: 15,
  total: 1285
}

// Mock data for library items
const libraryItems = [
  {
    id: 1,
    title: 'Mathematics Textbook',
    type: 'Book',
    status: 'Available'
  },
  {
    id: 2,
    title: 'Science Lab Equipment',
    type: 'Equipment',
    status: 'In Use'
  },
  {
    id: 3,
    title: 'History Reference',
    type: 'Book',
    status: 'Reserved'
  }
]

// Mock data for administrative tasks
const adminTasks = [
  {
    id: 1,
    title: 'Process new enrollments',
    priority: 'High',
    icon: UserPlus
  },
  {
    id: 2,
    title: 'Update student records',
    priority: 'Medium',
    icon: FileText
  },
  {
    id: 3,
    title: 'Review attendance reports',
    priority: 'Low',
    icon: Calendar
  }
]

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    title: 'New Student Enrollment',
    description: 'Anna Schmidt enrolled in Class 10A',
    time: '2 hours ago',
    icon: UserPlus,
    iconBg: 'bg-green-500'
  },
  {
    id: 2,
    title: 'Library Book Returned',
    description: 'Mathematics textbook returned by Max Weber',
    time: '3 hours ago',
    icon: BookOpen,
    iconBg: 'bg-blue-500'
  },
  {
    id: 3,
    title: 'Attendance Updated',
    description: 'Daily attendance recorded for all classes',
    time: '4 hours ago',
    icon: Calendar,
    iconBg: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'Fee Payment Received',
    description: 'Payment received from Lisa Müller\'s parents',
    time: '5 hours ago',
    icon: DollarSign,
    iconBg: 'bg-green-500'
  },
  {
    id: 5,
    title: 'Document Uploaded',
    description: 'New policy document uploaded to system',
    time: '6 hours ago',
    icon: FileText,
    iconBg: 'bg-orange-500'
  },
  {
    id: 6,
    title: 'System Maintenance',
    description: 'Scheduled maintenance completed successfully',
    time: '1 day ago',
    icon: Settings,
    iconBg: 'bg-gray-500'
  }
]

// Mock data for quick actions
const quickActions = [
  {
    id: 1,
    title: language.value === 'de' ? 'Schüler hinzufügen' : 'Add Student',
    icon: UserPlus,
    iconBg: 'bg-green-500'
  },
  {
    id: 2,
    title: language.value === 'de' ? 'Anwesenheit' : 'Attendance',
    icon: Calendar,
    iconBg: 'bg-blue-500'
  },
  {
    id: 3,
    title: language.value === 'de' ? 'Bibliothek' : 'Library',
    icon: BookOpen,
    iconBg: 'bg-purple-500'
  },
  {
    id: 4,
    title: language.value === 'de' ? 'Berichte' : 'Reports',
    icon: FileText,
    iconBg: 'bg-orange-500'
  },
  {
    id: 5,
    title: language.value === 'de' ? 'Nachrichten' : 'Messages',
    icon: MessageSquare,
    iconBg: 'bg-indigo-500'
  },
  {
    id: 6,
    title: language.value === 'de' ? 'Einstellungen' : 'Settings',
    icon: Settings,
    iconBg: 'bg-gray-500'
  }
]

// Helper functions for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'Inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getLibraryStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'In Use':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Reserved':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getTaskPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'Low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}
</script> 