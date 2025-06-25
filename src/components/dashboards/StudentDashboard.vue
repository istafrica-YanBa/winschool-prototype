<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Today's Schedule -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Calendar class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Heutiger Stundenplan' : 'Today\'s Schedule' }}
      </h2>
      <div class="space-y-3">
        <div 
          v-for="class_ in todaySchedule" 
          :key="class_.id"
          class="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
        >
          <div class="flex-shrink-0 w-16 text-center">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ class_.time }}</p>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ class_.subject }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ class_.teacher }} • {{ class_.room }}</p>
          </div>
          <div class="flex-shrink-0">
            <span :class="getStatusColor(class_.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getStatusText(class_.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="space-y-6">
      <!-- Grades Overview -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
          <BookOpen class="h-5 w-5 mr-2 text-blue-600" />
          {{ language === 'de' ? 'Noten-Übersicht' : 'Grades Overview' }}
        </h3>
        <div class="space-y-3">
          <div v-for="subject in recentGrades" :key="subject.name" class="flex justify-between items-center">
            <span class="text-sm text-slate-500 dark:text-slate-400">{{ subject.name }}</span>
            <span :class="getGradeColor(subject.grade)" class="font-semibold">{{ subject.grade }}</span>
          </div>
        </div>
      </div>

      <!-- Upcoming Assignments -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
          <FileText class="h-5 w-5 mr-2 text-blue-600" />
          {{ language === 'de' ? 'Anstehende Aufgaben' : 'Upcoming Assignments' }}
        </h3>
        <div class="space-y-3">
          <div v-for="assignment in upcomingAssignments" :key="assignment.id" class="border-l-4 border-blue-600 pl-3">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ assignment.title }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ assignment.subject }} • {{ assignment.dueDate }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Announcements -->
    <div class="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Bell class="h-5 w-5 mr-2 text-yellow-500" />
        {{ language === 'de' ? 'Aktuelle Ankündigungen' : 'Recent Announcements' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="announcement in announcements" :key="announcement.id" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ announcement.title }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ announcement.content }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">{{ announcement.date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Calendar, BookOpen, FileText, Bell } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const todaySchedule = [
  { id: 1, time: '08:00', subject: 'Mathematics', teacher: 'Dr. Weber', room: 'Room 101', status: 'upcoming' },
  { id: 2, time: '09:00', subject: 'German Literature', teacher: 'Ms. Schmidt', room: 'Room 205', status: 'current' },
  { id: 3, time: '10:00', subject: 'Physics', teacher: 'Prof. Mueller', room: 'Lab 1', status: 'upcoming' },
  { id: 4, time: '11:00', subject: 'History', teacher: 'Mr. Fischer', room: 'Room 302', status: 'upcoming' },
  { id: 5, time: '13:00', subject: 'English', teacher: 'Ms. Johnson', room: 'Room 108', status: 'upcoming' }
]

const recentGrades = [
  { name: 'Mathematics', grade: 'A-' },
  { name: 'Physics', grade: 'B+' },
  { name: 'German', grade: 'A' },
  { name: 'History', grade: 'B' },
  { name: 'English', grade: 'A-' }
]

const upcomingAssignments = [
  { id: 1, title: 'Calculus Problem Set', subject: 'Mathematics', dueDate: 'Tomorrow' },
  { id: 2, title: 'Essay on Goethe', subject: 'German Literature', dueDate: 'Friday' },
  { id: 3, title: 'Lab Report', subject: 'Physics', dueDate: 'Next Monday' }
]

const announcements = [
  {
    id: 1,
    title: 'School Sports Day',
    content: 'Annual sports day will be held next Friday. All students are encouraged to participate.',
    date: '2 days ago'
  },
  {
    id: 2,
    title: 'Library Hours Extended',
    content: 'The library will now be open until 8 PM on weekdays to support exam preparation.',
    date: '1 week ago'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'current':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'upcoming':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getStatusText = (status: string) => {
  const statusTexts = {
    en: { current: 'Current', upcoming: 'Upcoming', completed: 'Completed' },
    de: { current: 'Aktuell', upcoming: 'Anstehend', completed: 'Abgeschlossen' }
  }
  return statusTexts[language.value][status as keyof typeof statusTexts.en] || status
}

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-500 dark:text-green-400'
  if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400'
  if (grade.startsWith('C')) return 'text-yellow-500 dark:text-yellow-400'
  return 'text-red-500 dark:text-red-400'
}
</script>