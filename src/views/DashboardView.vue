<template>
  <div class="space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen p-6">
    <!-- Welcome Header -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div class="flex items-start">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-winschool-primary rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <BarChart3 class="h-5 w-5 sm:h-7 sm:w-7 text-slate-800" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-500 dark:text-slate-400 leading-tight">
              {{ language === 'de' ? 'Willkommen zurück' : 'Welcome back' }}, {{ user?.name }}!
            </h1>
            <p class="mt-1 sm:mt-2 text-sm sm:text-base text-slate-800 dark:text-slate-50">
              {{ language === 'de' ? 'Hier ist Ihre Übersicht für heute' : 'Here\'s your overview for today' }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm text-slate-500 dark:text-slate-300">{{ currentDate }}</p>
          <p class="text-lg font-semibold text-winschool-primary-dark">{{ currentTime }}</p>
        </div>
      </div>
    </div>

    <!-- Role-specific Dashboard Content -->
    <AdminDashboard v-if="['admin', 'schooladmin'].includes(user?.role || '')" />
    <TeacherDashboard v-else-if="user?.role === 'teacher'" />
    <StudentDashboard v-else-if="user?.role === 'student'" />
    <ParentDashboard v-else-if="user?.role === 'parent'" />
    <PrincipalDashboard v-else-if="user?.role === 'principal'" />
    <InspectorDashboard v-else-if="user?.role === 'inspector'" />
    <LibrarianDashboard v-else-if="user?.role === 'librarian'" />
    <SuperAdminDashboard v-else-if="user?.role === 'superadmin'" />
    <div v-else class="text-center text-slate-500 dark:text-slate-400">
      {{ language === 'de' ? 'Dashboard nicht verfügbar' : 'Dashboard not available' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { BarChart3 } from 'lucide-vue-next'
import StudentDashboard from '../components/dashboards/StudentDashboard.vue'
import ParentDashboard from '../components/dashboards/ParentDashboard.vue'
import TeacherDashboard from '../components/dashboards/TeacherDashboard.vue'
import AdminDashboard from '../components/dashboards/AdminDashboard.vue'
import PrincipalDashboard from '../components/dashboards/PrincipalDashboard.vue'
import InspectorDashboard from '../components/dashboards/InspectorDashboard.vue'
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard.vue'
import LibrarianDashboard from '../components/dashboards/LibrarianDashboard.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const user = computed(() => authStore.user)
const language = computed(() => themeStore.language)

const currentTime = ref('')
const currentDate = ref('')

const dashboardComponents = {
  student: StudentDashboard,
  parent: ParentDashboard,
  teacher: TeacherDashboard,
  admin: AdminDashboard,
  principal: PrincipalDashboard,
  inspector: InspectorDashboard,
  superadmin: SuperAdminDashboard,
  schooladmin: AdminDashboard, // School admin uses the same dashboard as regular admin for now
  schoolstaff: AdminDashboard // School staff uses the same dashboard as admin for now
}

const dashboardComponent = computed(() => {
  return dashboardComponents[user.value?.role || 'student']
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString(language.value === 'de' ? 'de-DE' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  currentDate.value = now.toLocaleDateString(language.value === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

let timeInterval: number

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
