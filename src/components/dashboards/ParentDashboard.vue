<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Children Overview -->
    <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Users class="h-5 w-5 mr-2 text-blue-600" />
        {{ language === 'de' ? 'Kinder-Übersicht' : 'Children Overview' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="child in children" :key="child.id" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <div class="flex items-center mb-3">
            <img :src="child.avatar" :alt="child.name" class="h-10 w-10 rounded-full object-cover mr-3" />
            <div>
              <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ child.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ child.class }} • {{ child.age }} years old</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Durchschnitt' : 'Average Grade' }}</p>
              <p :class="getGradeColor(child.averageGrade)" class="font-semibold">{{ child.averageGrade }}</p>
            </div>
            <div>
              <p class="text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Anwesenheit' : 'Attendance' }}</p>
              <p class="font-semibold text-green-500">{{ child.attendance }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="space-y-6">
      <!-- Financial Overview -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
          <DollarSign class="h-5 w-5 mr-2 text-blue-600" />
          {{ language === 'de' ? 'Finanzen' : 'Finances' }}
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Ausstehend' : 'Outstanding' }}</span>
            <span class="font-semibold text-red-500">€245.00</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-500 dark:text-slate-400">{{ language === 'de' ? 'Bezahlt' : 'Paid This Month' }}</span>
            <span class="font-semibold text-green-500">€180.00</span>
          </div>
          <button class="w-full bg-winschool-primary hover:bg-winschool-primary-dark text-slate-800 font-medium py-2 rounded-lg transition-colors text-sm">
            {{ language === 'de' ? 'Zahlung vornehmen' : 'Make Payment' }}
          </button>
        </div>
      </div>

      <!-- Recent Messages -->
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
          <MessageSquare class="h-5 w-5 mr-2 text-blue-600" />
          {{ language === 'de' ? 'Nachrichten' : 'Messages' }}
        </h3>
        <div class="space-y-3">
          <div v-for="message in recentMessages" :key="message.id" class="border-l-4 border-blue-600 pl-3">
            <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ message.from }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ message.subject }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ message.date }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center">
        <Calendar class="h-5 w-5 mr-2 text-yellow-500" />
        {{ language === 'de' ? 'Anstehende Termine' : 'Upcoming Events' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="event in upcomingEvents" :key="event.id" class="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h3 class="font-medium text-slate-800 dark:text-slate-50">{{ event.title }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ event.description }}</p>
          <div class="flex justify-between items-center mt-3">
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ event.date }}</span>
            <span :class="getEventTypeColor(event.type)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ event.type }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import { Users, DollarSign, MessageSquare, Calendar } from 'lucide-vue-next'

const themeStore = useThemeStore()
const language = computed(() => themeStore.language)

const children = [
  {
    id: 1,
    name: 'Emma Müller',
    class: 'Class 10A',
    age: 16,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    averageGrade: 'A-',
    attendance: 95
  },
  {
    id: 2,
    name: 'Liam Müller',
    class: 'Class 8B',
    age: 14,
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    averageGrade: 'B+',
    attendance: 92
  }
]

const recentMessages = [
  { id: 1, from: 'Dr. Weber (Math Teacher)', subject: 'Emma\'s excellent progress', date: '2 days ago' },
  { id: 2, from: 'School Administration', subject: 'Parent-Teacher Conference', date: '1 week ago' },
  { id: 3, from: 'Ms. Schmidt (German)', subject: 'Liam\'s assignment feedback', date: '1 week ago' }
]

const upcomingEvents = [
  {
    id: 1,
    title: 'Parent-Teacher Conference',
    description: 'Individual meetings with teachers',
    date: 'March 15, 2024',
    type: 'Meeting'
  },
  {
    id: 2,
    title: 'School Sports Day',
    description: 'Annual athletic competition',
    date: 'March 22, 2024',
    type: 'Event'
  },
  {
    id: 3,
    title: 'Science Fair',
    description: 'Student project presentations',
    date: 'April 5, 2024',
    type: 'Academic'
  }
]

const getGradeColor = (grade: string) => {
  if (grade.startsWith('A')) return 'text-green-500 dark:text-green-400'
  if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400'
  if (grade.startsWith('C')) return 'text-yellow-500 dark:text-yellow-400'
  return 'text-red-500 dark:text-red-400'
}

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Meeting':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Event':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Academic':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}
</script>