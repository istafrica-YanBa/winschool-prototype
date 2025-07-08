<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Library Overview -->
    <div class="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="metric in libraryMetrics" :key="metric.title" class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div :class="metric.iconBg" class="p-3 rounded-lg">
            <component :is="metric.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ metric.title }}</p>
            <p class="text-2xl font-bold text-slate-800 dark:text-slate-50">{{ metric.value }}</p>
            <p :class="metric.changeColor" class="text-xs flex items-center">
              <component :is="metric.trend === 'up' ? TrendingUp : TrendingDown" class="h-4 w-4 mr-1" />
              {{ metric.change }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="lg:col-span-2">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-4">
          <router-link v-for="action in quickActions" :key="action.label" :to="action.to" class="flex items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
            <component :is="action.icon" class="h-6 w-6 text-slate-600 dark:text-slate-300" />
            <span class="ml-3 text-sm font-medium text-slate-700 dark:text-slate-200">{{ action.label }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="lg:col-span-2">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">Recent Activity</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center">
            <div :class="activity.iconBg" class="p-2 rounded-lg">
              <component :is="activity.icon" class="h-5 w-5 text-white" />
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ activity.title }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Due Returns -->
    <div class="lg:col-span-2">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">Due Returns Today</h3>
        <div class="space-y-4">
          <div v-for="item in dueReturns" :key="item.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Book class="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ item.title }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.student }}</p>
              </div>
            </div>
            <button class="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              Mark Returned
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Reservations -->
    <div class="lg:col-span-2">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-50 mb-4">Pending Reservations</h3>
        <div class="space-y-4">
          <div v-for="reservation in pendingReservations" :key="reservation.id" class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <BookMarked class="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-slate-800 dark:text-slate-50">{{ reservation.title }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ reservation.student }}</p>
              </div>
            </div>
            <button class="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              Process
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Book, BookMarked, TrendingUp, TrendingDown, Users, CircleDollarSign, BookOpen } from 'lucide-vue-next'

const libraryMetrics = ref([
  {
    title: 'Total Books',
    value: '2,547',
    change: '+12% from last month',
    trend: 'up',
    icon: Book,
    iconBg: 'bg-blue-500',
    changeColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Active Loans',
    value: '186',
    change: '-3% from last month',
    trend: 'down',
    icon: BookOpen,
    iconBg: 'bg-amber-500',
    changeColor: 'text-red-600 dark:text-red-400'
  },
  {
    title: 'Active Users',
    value: '892',
    change: '+5% from last month',
    trend: 'up',
    icon: Users,
    iconBg: 'bg-green-500',
    changeColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Pending Fees',
    value: '€245',
    change: '-8% from last month',
    trend: 'down',
    icon: CircleDollarSign,
    iconBg: 'bg-purple-500',
    changeColor: 'text-red-600 dark:text-red-400'
  }
])

const quickActions = ref([
  { label: 'Books Management', to: '/dashboard/library/books', icon: Book },
  { label: 'Student Lending', to: '/dashboard/library/book-lending', icon: BookOpen },
  { label: 'Class Lending', to: '/dashboard/library/book-lending', icon: Users },
  { label: 'Reservations', to: '/dashboard/library/reservations', icon: BookMarked }
])

const recentActivity = ref([
  {
    id: 1,
    title: 'Book "Mathematics 101" returned',
    time: '5 minutes ago',
    icon: Book,
    iconBg: 'bg-green-500'
  },
  {
    id: 2,
    title: 'New reservation for "Physics Advanced"',
    time: '15 minutes ago',
    icon: BookMarked,
    iconBg: 'bg-purple-500'
  },
  {
    id: 3,
    title: 'Late fee collected - €5',
    time: '1 hour ago',
    icon: CircleDollarSign,
    iconBg: 'bg-blue-500'
  }
])

const dueReturns = ref([
  {
    id: 1,
    title: 'Chemistry Basics',
    student: 'John Smith'
  },
  {
    id: 2,
    title: 'World History Vol. 2',
    student: 'Emma Johnson'
  },
  {
    id: 3,
    title: 'Advanced Biology',
    student: 'Michael Brown'
  }
])

const pendingReservations = ref([
  {
    id: 1,
    title: 'Literature Anthology',
    student: 'Sarah Wilson'
  },
  {
    id: 2,
    title: 'Calculus Made Easy',
    student: 'David Lee'
  },
  {
    id: 3,
    title: 'German Grammar',
    student: 'Anna Schmidt'
  }
])
</script> 